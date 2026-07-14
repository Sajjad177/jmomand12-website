"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { CheckCircle2, Loader2, Receipt, RefreshCw, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMySalesOrders } from "../api/orders.api";

const POLL_WINDOW_MS = 20_000;
const POLL_INTERVAL_MS = 3_000;

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value?: string) {
  if (!value) return "Just now";
  return new Date(value).toLocaleString();
}

export function CheckoutSuccessPage() {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";
  const [pollingExpired, setPollingExpired] = useState(false);

  const ordersQuery = useQuery({
    queryKey: ["sales-orders", "checkout-success", sessionId],
    queryFn: getMySalesOrders,
    enabled: status === "authenticated" && Boolean(sessionId),
    refetchInterval: pollingExpired ? false : POLL_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });

  const matchedOrder = useMemo(
    () => ordersQuery.data?.find((order) => order.stripeSessionId === sessionId) ?? null,
    [ordersQuery.data, sessionId],
  );
  const confirmedOrder = matchedOrder?.status === "paid" ? matchedOrder : null;

  useEffect(() => {
    if (status !== "authenticated" || !sessionId || confirmedOrder || pollingExpired) return;

    const timer = window.setTimeout(() => {
      setPollingExpired(true);
    }, POLL_WINDOW_MS);

    return () => window.clearTimeout(timer);
  }, [confirmedOrder, pollingExpired, sessionId, status]);

  if (status === "loading" || (status === "authenticated" && ordersQuery.isLoading)) {
    return (
      <section className="container flex min-h-[70vh] items-center justify-center py-16">
        <div className="rounded-3xl border border-[#dce6f5] bg-white p-10 text-center shadow-sm">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#003da5]" />
          <p className="mt-4 text-lg font-semibold text-[#111827]">Checking your payment status...</p>
          <p className="mt-2 text-sm text-[#64748b]">We&apos;re waiting for the checkout confirmation.</p>
        </div>
      </section>
    );
  }

  if (status === "unauthenticated") {
    return (
      <section className="container flex min-h-[70vh] items-center justify-center py-16">
        <div className="max-w-xl rounded-3xl border border-[#dce6f5] bg-white p-10 text-center shadow-sm">
          <Receipt className="mx-auto h-10 w-10 text-[#003da5]" />
          <h1 className="mt-4 text-3xl font-bold text-[#111827]">Sign in to verify your order</h1>
          <p className="mt-3 text-sm leading-6 text-[#64748b]">
            Checkout returned successfully, but we need your account session to confirm the final order state.
          </p>
          <Button asChild className="mt-6 rounded-xl bg-[#003da5] hover:bg-[#00358e]">
            <Link href={`/login?callbackUrl=${encodeURIComponent(`/orders/success?session_id=${sessionId}`)}`}>
              Sign in to continue
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  if (!sessionId) {
    return (
      <section className="container flex min-h-[70vh] items-center justify-center py-16">
        <div className="max-w-xl rounded-3xl border border-[#dce6f5] bg-white p-10 text-center shadow-sm">
          <Receipt className="mx-auto h-10 w-10 text-[#003da5]" />
          <h1 className="mt-4 text-3xl font-bold text-[#111827]">Checkout returned without a session id</h1>
          <p className="mt-3 text-sm leading-6 text-[#64748b]">
            We couldn&apos;t link this return to a specific Stripe checkout session. You can still review your sales orders.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-xl bg-[#003da5] hover:bg-[#00358e]">
              <Link href="/orders">View order history</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-[#dce6f5]">
              <Link href="/cart">Back to cart</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (ordersQuery.isError) {
    return (
      <section className="container flex min-h-[70vh] items-center justify-center py-16">
        <div className="max-w-2xl rounded-3xl border border-[#fecaca] bg-white p-10 text-center shadow-sm">
          <Receipt className="mx-auto h-10 w-10 text-[#b91c1c]" />
          <h1 className="mt-5 text-3xl font-bold text-[#991b1b]">We couldn&apos;t verify your order yet</h1>
          <p className="mt-3 text-sm leading-6 text-[#b91c1c]">
            Stripe returned successfully, but the frontend could not load your order history from the API.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              className="rounded-xl bg-[#003da5] hover:bg-[#00358e]"
              onClick={() => void ordersQuery.refetch()}
            >
              <RefreshCw className="h-4 w-4" />
              Retry verification
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-[#dce6f5]">
              <Link href="/orders">View order history</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (confirmedOrder) {
    return (
      <section className="container flex min-h-[70vh] items-center justify-center py-16">
        <div className="max-w-2xl rounded-3xl border border-[#dce6f5] bg-white p-10 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-[#ecfdf5] p-4 text-[#16a34a]">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mt-5 text-3xl font-bold text-[#111827]">Payment confirmed</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#64748b]">
              Your order has been finalized and recorded successfully. We verified the result through your order history.
            </p>
          </div>

          <div className="mt-8 grid gap-4 rounded-2xl border border-[#dce6f5] bg-[#f8fbff] p-5 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">Order</p>
              <p className="mt-2 text-lg font-bold text-[#111827]">{confirmedOrder.orderNumber}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">Total</p>
              <p className="mt-2 text-lg font-bold text-[#111827]">{formatMoney(confirmedOrder.totalAmount)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">Paid at</p>
              <p className="mt-2 text-sm font-semibold text-[#111827]">{formatDate(confirmedOrder.paidAt)}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-xl bg-[#003da5] hover:bg-[#00358e]">
              <Link href="/orders">
                <Receipt className="h-4 w-4" />
                View order history
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-[#dce6f5]">
              <Link href="/category">
                <ShoppingBag className="h-4 w-4" />
                Continue shopping
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="max-w-2xl rounded-3xl border border-[#dce6f5] bg-white p-10 text-center shadow-sm">
        <div className="rounded-full bg-[#eef4ff] p-4 text-[#003da5] mx-auto w-fit">
          {pollingExpired ? <Receipt className="h-10 w-10" /> : <Loader2 className="h-10 w-10 animate-spin" />}
        </div>
        <h1 className="mt-5 text-3xl font-bold text-[#111827]">
          {pollingExpired ? "We haven't confirmed your order yet" : "Still finalizing your order"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#64748b]">
          {pollingExpired
            ? "Stripe returned successfully, but the backend webhook may still be processing your payment. You can retry the check or review your order history."
            : "Your payment appears to have returned from Stripe. We’re checking your sales orders for the final paid status now."}
        </p>
        <p className="mt-4 text-xs text-[#94a3b8]">Stripe session: {sessionId}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            className="rounded-xl bg-[#003da5] hover:bg-[#00358e]"
            onClick={() => {
              setPollingExpired(false);
              void ordersQuery.refetch();
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Check again
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-[#dce6f5]">
            <Link href="/orders">View order history</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-[#dce6f5]">
            <Link href="/cart">Back to cart</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
