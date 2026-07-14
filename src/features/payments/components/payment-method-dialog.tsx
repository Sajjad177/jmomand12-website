"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getMyProfile } from "@/features/dashboard/api/dashboard.api";
import { dashboardKeys } from "@/features/dashboard/hooks/useDashboardData";
import {
  createSetupIntent,
  createTestDefaultPaymentMethod,
  saveDefaultPaymentMethod,
} from "../api/payment.api";

type PaymentMethodDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onSuccess?: () => void | Promise<void>;
};

type SetupState = {
  clientSecret: string;
  setupIntentId: string;
  publishableKey: string;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message ===
      "string"
  ) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function isStripeConfigurationError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("stripe is not configured") ||
    normalized.includes("stripe rejected the configured secret key") ||
    normalized.includes("publishable key") ||
    normalized.includes("secret key")
  );
}

function isNetworkError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("network error") || normalized.includes("cors") || normalized.includes("failed to fetch");
}

function formatSetupFailure(message: string) {
  if (isStripeConfigurationError(message)) {
    return {
      title: "Card setup is unavailable in this environment",
      body:
        "The backend Stripe configuration is incomplete, so the frontend cannot create a secure card setup session right now.",
      hint:
        "A valid Stripe secret key is required on the server before real card entry can work. If this is a dev environment, the test helper may still work if the backend has a valid Stripe test key.",
    };
  }

  if (isNetworkError(message)) {
    return {
      title: "We couldn't reach the payment service",
      body:
        "The frontend could not start the payment setup request. This is usually caused by CORS, API availability, or an expired session.",
      hint: "Retry once. If it keeps happening, check that the API is reachable from this frontend origin.",
    };
  }

  return {
    title: "We couldn't prepare secure card setup",
    body: message,
    hint: "You can retry the secure setup flow or use the dev helper when available.",
  };
}

function PaymentForm({
  setupState,
  busy,
  inlineError,
  onConfirm,
  onError,
}: {
  setupState: SetupState;
  busy: boolean;
  inlineError: string;
  onConfirm: (setupIntentId: string) => Promise<void>;
  onError: (message: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    onError("");

    const submitResult = await elements.submit();
    if (submitResult.error) {
      onError(submitResult.error.message || "Please check your card details and try again.");
      return;
    }

    const confirmation = await stripe.confirmSetup({
      elements,
      clientSecret: setupState.clientSecret,
      redirect: "if_required",
    });

    if (confirmation.error) {
      onError(confirmation.error.message || "Card confirmation failed.");
      return;
    }

    try {
      const confirmedId = confirmation.setupIntent?.id || setupState.setupIntentId;
      await onConfirm(confirmedId);
    } catch (error) {
      onError(getErrorMessage(error, "We couldn't save that payment method."));
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#dce6f5] bg-[#f8fbff] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#111827]">
          <CreditCard className="h-4 w-4 text-[#003da5]" />
          Card details
        </div>
        <div className="rounded-xl border border-[#dce6f5] bg-white p-4">
          <PaymentElement
            options={{
              layout: "tabs",
              fields: {
                billingDetails: {
                  address: "never",
                },
              },
            }}
          />
        </div>
      </div>

      {inlineError ? (
        <div className="flex items-start gap-2 rounded-xl border border-[#fecaca] bg-[#fff7f7] p-3 text-sm text-[#991b1b]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{inlineError}</span>
        </div>
      ) : null}

      <Button
        type="button"
        className="h-11 w-full rounded-xl bg-[#fe6819] text-white hover:bg-[#e45c12]"
        onClick={() => {
          void handleSubmit();
        }}
        disabled={!stripe || !elements || busy}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
        {busy ? "Saving card..." : "Save payment method"}
      </Button>
    </div>
  );
}

export function PaymentMethodDialog({
  open,
  onOpenChange,
  title = "Add a payment method",
  description = "Save a card securely before placing bids. Your card is stored with Stripe for future auction payments.",
  onSuccess,
}: PaymentMethodDialogProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [setupState, setSetupState] = useState<SetupState | null>(null);
  const [inlineError, setInlineError] = useState("");
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const hasInitializedForOpenRef = useRef(false);

  const setupIntentMutation = useMutation({
    mutationFn: createSetupIntent,
    onSuccess: (result) => {
      if (!result.clientSecret || !result.publishableKey) {
        setInlineError("Stripe is not fully configured yet. Please try again later.");
        return;
      }

      setSetupState({
        clientSecret: result.clientSecret,
        setupIntentId: result.setupIntentId,
        publishableKey: result.publishableKey,
      });
      setStripePromise(loadStripe(result.publishableKey));
    },
    onError: (error) => {
      setInlineError(getErrorMessage(error, "We couldn't prepare secure card setup."));
    },
  });

  const saveDefaultMutation = useMutation({
    mutationFn: saveDefaultPaymentMethod,
    onError: (error) => {
      setInlineError(getErrorMessage(error, "We couldn't save that payment method."));
    },
  });

  const testCardMutation = useMutation({
    mutationFn: createTestDefaultPaymentMethod,
    onError: (error) => {
      setInlineError(getErrorMessage(error, "The test payment helper is not available right now."));
    },
  });

  const elementsOptions: StripeElementsOptions | undefined = setupState?.clientSecret
    ? {
        clientSecret: setupState.clientSecret,
        appearance: {
          theme: "stripe",
        },
        loader: "auto",
      }
    : undefined;

  const isBusy =
    setupIntentMutation.isPending || saveDefaultMutation.isPending || testCardMutation.isPending;
  const canUseDevHelper = process.env.NODE_ENV !== "production";

  function prepareSetupIntent() {
    if (setupIntentMutation.isPending || hasInitializedForOpenRef.current) return;
    hasInitializedForOpenRef.current = true;
    setInlineError("");
    setSetupState(null);
    setStripePromise(null);
    setupIntentMutation.mutate(undefined, {
      onError: () => {
        hasInitializedForOpenRef.current = false;
      },
    });
  }

  async function handleConfirm(setupIntentId: string) {
    setInlineError("");
    await saveDefaultMutation.mutateAsync({ setupIntentId });
    await queryClient.invalidateQueries({ queryKey: dashboardKeys.profile });
    await queryClient.invalidateQueries({ queryKey: ["auth", "navbar-profile"] });

    const refreshedProfile = await queryClient.fetchQuery({
      queryKey: dashboardKeys.profile,
      queryFn: getMyProfile,
    });

    if (!refreshedProfile?.hasDefaultPaymentMethod) {
      throw new Error("Your card was confirmed, but the account is not marked as payment-ready yet.");
    }

    toast.success("Payment method saved successfully.");
    if (onSuccess) {
      await onSuccess();
    }
    handleDialogOpenChange(false);
  }

  async function handleUseTestCard() {
    setInlineError("");
    await testCardMutation.mutateAsync("pm_card_visa");
    await queryClient.invalidateQueries({ queryKey: dashboardKeys.profile });
    await queryClient.invalidateQueries({ queryKey: ["auth", "navbar-profile"] });

    const refreshedProfile = await queryClient.fetchQuery({
      queryKey: dashboardKeys.profile,
      queryFn: getMyProfile,
    });

    if (!refreshedProfile?.hasDefaultPaymentMethod) {
      throw new Error("The test payment method was created, but the account is not marked as payment-ready yet.");
    }

    toast.success("Test payment method saved successfully.");
    if (onSuccess) {
      await onSuccess();
    }
    handleDialogOpenChange(false);
  }

  function handleDialogOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setInlineError("");
    } else {
      hasInitializedForOpenRef.current = false;
      setInlineError("");
      setSetupState(null);
      setStripePromise(null);
      setupIntentMutation.reset();
      saveDefaultMutation.reset();
      testCardMutation.reset();
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-w-xl rounded-3xl border-[#dce6f5] p-0 sm:max-w-xl">
        <div className="overflow-hidden rounded-3xl">
          <div className="bg-[#f8fbff] px-6 py-5">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#111827]">{title}</DialogTitle>
              <DialogDescription className="text-sm text-[#64748b]">
                {description}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div className="grid gap-3 rounded-2xl border border-[#dce6f5] bg-white p-4 text-sm text-[#475569]">
              <div className="flex items-center gap-2 font-semibold text-[#111827]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#eef4ff] text-xs text-[#003da5]">
                  1
                </span>
                Prepare a secure Stripe setup session
              </div>
              <div className="flex items-center gap-2 font-semibold text-[#111827]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#eef4ff] text-xs text-[#003da5]">
                  2
                </span>
                Enter your card details
              </div>
              <div className="flex items-center gap-2 font-semibold text-[#111827]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#eef4ff] text-xs text-[#003da5]">
                  3
                </span>
                Confirm and save your default payment method
              </div>
            </div>

            {setupIntentMutation.isPending && !setupState ? (
              <div className="flex h-40 items-center justify-center rounded-2xl border border-[#dce6f5] bg-[#f8fbff]">
                <div className="flex items-center gap-2 text-sm font-medium text-[#475569]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparing secure card setup...
                </div>
              </div>
            ) : null}

            {!setupIntentMutation.isPending && !setupState && !inlineError ? (
              <div className="rounded-2xl border border-[#dce6f5] bg-[#f8fbff] p-5">
                <p className="text-sm text-[#475569]">
                  Start a secure Stripe setup session to load the card form. This helps avoid broken
                  or repeated requests when the dialog first opens.
                </p>
                <Button
                  type="button"
                  className="mt-4 h-11 rounded-xl bg-[#fe6819] text-white hover:bg-[#e45c12]"
                  onClick={prepareSetupIntent}
                  disabled={isBusy}
                >
                  <CreditCard className="h-4 w-4" />
                  Continue to card setup
                </Button>
              </div>
            ) : null}

            {setupState && stripePromise && elementsOptions ? (
              <Elements key={setupState.setupIntentId} stripe={stripePromise} options={elementsOptions}>
                <PaymentForm
                  setupState={setupState}
                  busy={isBusy}
                  inlineError={inlineError}
                  onConfirm={handleConfirm}
                  onError={setInlineError}
                />
              </Elements>
            ) : null}

            {!setupIntentMutation.isPending && !setupState && inlineError ? (() => {
              const setupFailure = formatSetupFailure(inlineError);

              return (
              <div className="rounded-xl border border-[#fecaca] bg-[#fff7f7] p-4 text-sm text-[#991b1b]">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-semibold">{setupFailure.title}</p>
                    <p>{setupFailure.body}</p>
                    <p className="text-xs text-[#7f1d1d]">{setupFailure.hint}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 h-10 rounded-xl border-[#f5c2c7] bg-white text-[#991b1b] hover:bg-[#fff1f2]"
                  onClick={prepareSetupIntent}
                  disabled={isBusy}
                >
                  Retry secure setup
                </Button>
              </div>
              );
            })() : null}

            {canUseDevHelper ? (
              <div className="rounded-2xl border border-dashed border-[#dce6f5] bg-[#fcfdff] p-4">
                <p className="text-sm font-semibold text-[#111827]">Development helper</p>
                <p className="mt-1 text-sm text-[#64748b]">
                  Use a Stripe test payment method for local bidding flow checks.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 h-10 rounded-xl border-[#dce6f5]"
                  onClick={() => {
                    void handleUseTestCard().catch((error) => {
                      setInlineError(
                        getErrorMessage(error, "The test payment helper is not available right now."),
                      );
                    });
                  }}
                  disabled={isBusy || !session}
                >
                  {testCardMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  Use test card
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
