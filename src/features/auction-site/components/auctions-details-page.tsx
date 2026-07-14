"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Timer,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { dashboardKeys } from "@/features/dashboard/hooks/useDashboardData";
import { getMyProfile } from "@/features/dashboard/api/dashboard.api";
import { PaymentMethodDialog } from "@/features/payments/components/payment-method-dialog";
import { createBid } from "@/features/payments/api/payment.api";
import { AuctionPrimaryButton, AuctionOutlineButton } from "./auction-buttons";
import { getAuctionProductDetails } from "../api/auction.api";

function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

function formatCondition(value?: string) {
  if (!value) return "Unknown";
  return value.replace(/_/g, " ");
}

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

function getCountdownParts(endDate?: string | null, _tick?: number) {
  void _tick;

  if (!endDate) {
    return { days: "00", hours: "00", mins: "00", secs: "00", ended: true };
  }

  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) {
    return { days: "00", hours: "00", mins: "00", secs: "00", ended: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    mins: String(mins).padStart(2, "0"),
    secs: String(secs).padStart(2, "0"),
    ended: false,
  };
}

export default function AuctionProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status } = useSession();
  const productId = String(params?.id || params?.productId || "");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [countdownTick, setCountdownTick] = useState(0);
  const [queuedBidAfterPayment, setQueuedBidAfterPayment] = useState<number | null>(null);

  const lotQuery = useQuery({
    queryKey: ["auction-product-details", productId],
    queryFn: () => getAuctionProductDetails(productId),
    enabled: Boolean(productId),
  });

  const profileQuery = useQuery({
    queryKey: dashboardKeys.profile,
    queryFn: getMyProfile,
    enabled: status === "authenticated",
    staleTime: 60_000,
  });

  const bidMutation = useMutation({
    mutationFn: createBid,
    onSuccess: async () => {
      toast.success("Bid placed successfully.");
      await queryClient.invalidateQueries({ queryKey: ["auction-product-details", productId] });
      await queryClient.invalidateQueries({ queryKey: dashboardKeys.auctionActivity });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "We couldn't place your bid."));
    },
  });

  const lot = lotQuery.data;
  const product = lot?.product;
  const galleryImages =
    product?.images?.length ? product.images : [{ public_id: "placeholder", url: "/images/login.jpg" }];
  const currentDisplayImage = galleryImages[activeImageIndex]?.url || galleryImages[0]?.url;
  const minimumNextBid = lot?.minimumNextBid ?? 0;
  const currentBid = lot?.highestBid.amount && lot.highestBid.amount > 0
    ? lot.highestBid.amount
    : lot?.startingBid ?? 0;
  const quickBidAmount = minimumNextBid > 0 ? minimumNextBid : currentBid;
  const hasPaymentMethod = Boolean(profileQuery.data?.hasDefaultPaymentMethod);
  const canBid = Boolean(lot?.canBid && !getCountdownParts(lot?.auction?.endsAt).ended);
  const statusLabel = lot?.status ? formatCondition(lot.status) : "loading";

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdownTick(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const countdown = getCountdownParts(lot?.auction?.endsAt, countdownTick);
  const displayedBidAmount = bidAmount || (minimumNextBid ? minimumNextBid.toFixed(2) : "");

  async function submitBidAmount(amount: number) {
    await bidMutation.mutateAsync({
      auctionProductId: lot!.auctionProductId,
      amount,
    });
  }

  async function handleBidSubmit(nextAmount?: number) {
    if (!lot) return;

    if (status !== "authenticated") {
      const callbackUrl = encodeURIComponent(`/auction-details/${productId}`);
      router.push(`/login?callbackUrl=${callbackUrl}`);
      return;
    }

    if (!hasPaymentMethod) {
      setQueuedBidAfterPayment(nextAmount ?? Number(displayedBidAmount));
      setPaymentDialogOpen(true);
      return;
    }

    const parsedAmount = nextAmount ?? Number(displayedBidAmount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Enter a valid bid amount.");
      return;
    }

    if (parsedAmount < minimumNextBid) {
      toast.error(`Minimum next bid is ${formatCurrency(minimumNextBid)}.`);
      return;
    }

    setQueuedBidAfterPayment(null);
    await submitBidAmount(parsedAmount);
  }

  if (lotQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9fc]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#003da5] border-t-transparent" />
      </div>
    );
  }

  if (lotQuery.isError || !lot || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f9fc] p-4 text-center">
        <p className="text-sm font-bold text-slate-700">We couldn&apos;t load this auction lot right now.</p>
        <button onClick={() => router.back()} className="mt-3 text-xs font-bold text-[#003da5] hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <main className="bg-[#f7f9fc]">
        <section className="container py-10">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_380px]">
            <div className="space-y-4">
              <div className="auction-card rounded-[8px] bg-white p-6">
                <div className="relative h-[520px] overflow-hidden rounded-[4px] bg-white">
                  <Image
                    src={currentDisplayImage}
                    alt={product.title}
                    fill
                    priority
                    className="object-contain"
                  />
                  <div className="absolute bottom-4 right-4 rounded-[8px] bg-[#eef4ff] px-4 py-2 text-[12px] text-[#111827]">
                    {activeImageIndex + 1}/{galleryImages.length}
                  </div>
                  {galleryImages.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
                        }
                        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111827] shadow-sm"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
                        }
                        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111827] shadow-sm"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  ) : null}
                </div>

                <div className="mt-4 grid grid-cols-6 gap-3">
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${image.public_id}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative h-[56px] overflow-hidden rounded-[8px] border p-2 transition-all ${
                        index === activeImageIndex
                          ? "border-2 border-[#003da5]"
                          : "border-[#dce6f5] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={image.url} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="auction-card rounded-[8px] bg-white p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex rounded-[4px] bg-[#eef4ff] px-3 py-1 text-[11px] font-black uppercase text-[#003da5]">
                    Lot #{product.inventoryId || "UNKNOWN"}
                  </div>
                  <div className="inline-flex rounded-[4px] bg-[#fff3eb] px-3 py-1 text-[11px] font-black uppercase text-[#fe6819]">
                    {statusLabel}
                  </div>
                  {lot.auction?.auctionId ? (
                    <div className="inline-flex rounded-[4px] bg-[#f8fafc] px-3 py-1 text-[11px] font-black uppercase text-[#475569]">
                      Auction {lot.auction.auctionId}
                    </div>
                  ) : null}
                </div>

                <h1 className="mt-4 max-w-[780px] text-[28px] font-bold leading-[1.2] text-[#1e293b] lg:text-[36px]">
                  {product.title}
                </h1>

                <div className="mt-5 grid gap-4 border-b border-[#dce6f5] pb-5 md:grid-cols-4">
                  <div className="text-center md:border-r md:border-[#dce6f5]">
                    <div className="text-[11px] text-[#6b7280]">Current bid</div>
                    <div className="mt-1 text-[16px] font-semibold text-[#111827]">
                      {formatCurrency(currentBid)}
                    </div>
                  </div>
                  <div className="text-center md:border-r md:border-[#dce6f5]">
                    <div className="text-[11px] text-[#6b7280]">Starting bid</div>
                    <div className="mt-1 text-[13px] font-medium text-[#374151]">
                      {formatCurrency(lot.startingBid)}
                    </div>
                  </div>
                  <div className="text-center md:border-r md:border-[#dce6f5]">
                    <div className="text-[11px] text-[#6b7280]">Category</div>
                    <div className="mt-1 text-[13px] font-medium text-[#374151]">{product.category}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] text-[#6b7280]">Condition</div>
                    <div className="mt-1 text-[13px] font-medium capitalize text-[#ff6b1a]">
                      {formatCondition(product.condition)}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h2 className="text-[14px] font-bold text-[#111827]">Product description</h2>
                  <p className="mt-2 max-w-[850px] text-[13px] leading-6 text-[#6b7280]">
                    {product.description || "No product description is available for this lot yet."}
                  </p>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="rounded-[8px] bg-[#eef4ff] px-4 py-4">
                    <div className="text-[12px] text-[#6b7280]">Auction window</div>
                    <div className="mt-1 text-[14px] font-bold text-[#003da5]">
                      {lot.auction?.startsAt
                        ? `${new Date(lot.auction.startsAt).toLocaleDateString()} - ${new Date(
                            lot.auction.endsAt,
                          ).toLocaleDateString()}`
                        : "Schedule unavailable"}
                    </div>
                  </div>
                  <div className="rounded-[8px] bg-[#eef4ff] px-4 py-4">
                    <div className="text-[12px] text-[#6b7280]">Bid increment</div>
                    <div className="mt-1 text-[14px] font-bold text-[#003da5]">
                      {formatCurrency(lot.bidIncrement)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="auction-card overflow-hidden rounded-[8px] bg-white">
                <div className="border-b border-[#dce6f5] px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-[#003da5]">
                  Specifications overview
                </div>
                <div className="px-5 py-6">
                  <h2 className="text-[22px] font-bold text-[#111827]">Lot details</h2>
                  <div className="mt-4 space-y-4 text-[13px] leading-6 text-[#6b7280]">
                    <p>
                      Review the lot details, current bidding state, and payment readiness before placing a bid.
                      Bids are charged only if you win when the auction closes.
                    </p>
                  </div>

                  <div className="mt-6 overflow-hidden rounded-[4px] border border-[#e5edf8]">
                    <div className="grid grid-cols-[1fr_1fr] border-b border-[#e5edf8] text-[12px]">
                      <div className="bg-[#f8fbff] px-4 py-3 text-[#6b7280]">Manufacturer</div>
                      <div className="px-4 py-3 text-[#6b7280]">{product.manufacturer || "Not specified"}</div>
                    </div>
                    <div className="grid grid-cols-[1fr_1fr] border-b border-[#e5edf8] text-[12px]">
                      <div className="bg-[#f8fbff] px-4 py-3 text-[#6b7280]">Colors</div>
                      <div className="px-4 py-3 text-[#6b7280]">
                        {product.color?.length ? product.color.join(", ") : "Not specified"}
                      </div>
                    </div>
                    <div className="grid grid-cols-[1fr_1fr] border-b border-[#e5edf8] text-[12px]">
                      <div className="bg-[#f8fbff] px-4 py-3 text-[#6b7280]">Inventory status</div>
                      <div className="px-4 py-3 capitalize text-[#6b7280]">
                        {formatCondition(product.inventoryStatus)}
                      </div>
                    </div>
                    <div className="grid grid-cols-[1fr_1fr] text-[12px]">
                      <div className="bg-[#f8fbff] px-4 py-3 text-[#6b7280]">Reviews</div>
                      <div className="px-4 py-3 text-[#6b7280]">
                        {product.totalReview} reviews • {product.averageReview.toFixed(1)} avg rating
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="auction-card overflow-hidden rounded-[8px] bg-white">
                <div className="border-b border-[#dce6f5] bg-[#eef4ff] px-4 py-3">
                  <span className="text-[12px] font-bold text-[#0b57d0]">
                    {canBid ? "• Live Auction" : "• Bidding Unavailable"}
                  </span>
                </div>
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[12px] text-[#6b7280]">Current bid</div>
                      <div className="flex items-end gap-2">
                        <div className="text-[46px] font-black leading-none text-[#111827]">
                          {formatCurrency(currentBid)}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[12px] text-[#6b7280]">
                        <Timer className="h-4 w-4 text-[#0b57d0]" />
                        Ends {lot.auction?.endsAt ? new Date(lot.auction.endsAt).toLocaleString() : "soon"}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[#dce6f5] bg-[#f8fbff] px-3 py-2 text-right">
                      <div className="text-[11px] uppercase text-[#6b7280]">Min next bid</div>
                      <div className="text-lg font-bold text-[#111827]">{formatCurrency(minimumNextBid)}</div>
                    </div>
                  </div>

                  <div className="rounded-[8px] bg-[#eef4ff] p-4">
                    <div className="text-center text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                      Time remaining
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {[
                        [countdown.days, "Days"],
                        [countdown.hours, "Hours"],
                        [countdown.mins, "Mins"],
                        [countdown.secs, "Secs"],
                      ].map(([value, label]) => (
                        <div key={label} className="rounded-[6px] bg-white px-3 py-3 text-center">
                          <div className="text-[22px] font-bold text-[#111827]">{value}</div>
                          <div className="mt-1 text-[10px] font-bold uppercase text-[#6b7280]">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!hasPaymentMethod ? (
                    <div className="rounded-[8px] border border-[#f7d288] bg-[#fff9e9] px-4 py-3 text-[12px] text-[#b66500]">
                      Save a payment method before bidding so we can securely charge the winning card when the
                      auction closes.
                    </div>
                  ) : (
                    <div className="rounded-[8px] border border-[#d1fae5] bg-[#ecfdf5] px-4 py-3 text-[12px] text-[#047857]">
                      Your default payment method is saved and ready for bidding.
                    </div>
                  )}

                  <AuctionPrimaryButton
                    className="h-11 w-full text-[13px]"
                    disabled={bidMutation.isPending || !canBid}
                    onClick={() => void handleBidSubmit(quickBidAmount)}
                  >
                    {bidMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    Quick Bid: {formatCurrency(quickBidAmount)}
                  </AuctionPrimaryButton>

                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={minimumNextBid || 0}
                      step="0.01"
                      value={bidAmount}
                      onChange={(event) => setBidAmount(event.target.value)}
                      className="h-11 flex-1 rounded-[4px] border-[#dce6f5] bg-white px-3 text-[13px] text-[#111827]"
                      placeholder={`Enter at least ${formatCurrency(minimumNextBid)}`}
                      disabled={!canBid || bidMutation.isPending}
                    />
                    <AuctionOutlineButton
                      className="h-11 px-4 text-[12px]"
                      disabled={!canBid || bidMutation.isPending}
                      onClick={() => void handleBidSubmit()}
                    >
                      {bidMutation.isPending ? "Submitting..." : "Place Bid"}
                    </AuctionOutlineButton>
                  </div>

                  <div className="rounded-2xl border border-[#dce6f5] bg-[#f8fbff] p-4 text-[12px] text-[#6b7280]">
                    <p className="font-semibold text-[#111827]">Bidding rules</p>
                    <p className="mt-2">
                      Bids must be at least {formatCurrency(minimumNextBid)}. Current increment is{" "}
                      {formatCurrency(lot.bidIncrement)}.
                    </p>
                    {!canBid ? (
                      <p className="mt-2 text-[#b45309]">
                        This lot is currently {statusLabel}. Bidding is only available while the lot is active.
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-center gap-8 pt-2 text-center text-[10px] font-bold uppercase text-[#111827]">
                    <div>
                      <Lock className="mx-auto mb-1 h-4 w-4 text-[#111827]" />
                      Secure
                    </div>
                    <div>
                      <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-[#0b57d0]" />
                      Verified
                    </div>
                    <div>
                      <Truck className="mx-auto mb-1 h-4 w-4 text-[#fe6819]" />
                      Pickup
                    </div>
                  </div>
                </div>
              </div>

              <div className="auction-card overflow-hidden rounded-[8px] bg-white">
                <div className="flex items-center justify-between border-b border-[#dce6f5] bg-[#f8fbff] px-4 py-3">
                  <span className="text-[14px] font-bold text-[#111827]">Live lot activity</span>
                  <span className="text-[11px] uppercase text-[#6b7280]">{statusLabel}</span>
                </div>
                <div className="space-y-3 p-4 text-[12px] text-[#475569]">
                  <div className="flex items-center justify-between rounded-xl border border-[#dce6f5] px-3 py-3">
                    <span>Highest bidder</span>
                    <span className="font-semibold text-[#111827]">
                      {lot.highestBid.bidder
                        ? `${lot.highestBid.bidder.firstName} ${lot.highestBid.bidder.lastName}`
                        : "No bids yet"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#dce6f5] px-3 py-3">
                    <span>Winning status</span>
                    <span className="font-semibold text-[#111827]">
                      {lot.winner ? `${lot.winner.firstName} ${lot.winner.lastName}` : "Still open"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#dce6f5] px-3 py-3">
                    <span>Payment status</span>
                    <span className="font-semibold capitalize text-[#111827]">
                      {formatCondition(lot.paymentStatus)}
                    </span>
                  </div>
                  {!hasPaymentMethod ? (
                    <button
                      type="button"
                      onClick={() => setPaymentDialogOpen(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003da5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#00358e]"
                    >
                      <CreditCard className="h-4 w-4" />
                      Add payment method to bid
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PaymentMethodDialog
        open={paymentDialogOpen}
        onOpenChange={(nextOpen) => {
          setPaymentDialogOpen(nextOpen);
          if (!nextOpen) {
            setQueuedBidAfterPayment(null);
          }
        }}
        title="Save your card before bidding"
        description="You need a default payment method on file before the system can accept your bid for this lot."
        onSuccess={async () => {
          const refreshedProfile = await profileQuery.refetch();
          await lotQuery.refetch();

          if (!refreshedProfile.data?.hasDefaultPaymentMethod) {
            toast.error("Your account still is not marked as payment-ready. Please try again.");
            return;
          }

          if (queuedBidAfterPayment != null && Number.isFinite(queuedBidAfterPayment)) {
            const nextBid = queuedBidAfterPayment;
            setQueuedBidAfterPayment(null);
            await submitBidAmount(nextBid);
          }
        }}
      />
    </>
  );
}
