"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { AuctionCardProps } from "../../types/AuctionType";
import { createBid } from "@/features/payments/api/payment.api";
import { getMyProfile } from "@/features/dashboard/api/dashboard.api";
import { dashboardKeys } from "@/features/dashboard/hooks/useDashboardData";
import { PaymentMethodDialog } from "@/features/payments/components/payment-method-dialog";
import { AuthRequiredModal } from "@/components/auth-required-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Extended inline interface safely handling the extra properties from the image design
interface RefinedAuctionCardProps extends AuctionCardProps {
  description?: string;
  condition?: string;
  status?: string;
  auctionProductId?: string;
  startingBid?: number;
  bidIncrement?: number;
  highestBidAmount?: number;
  onBidPlaced?: () => void;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message === "string"
  ) {
    return (
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message ?? fallback
    );
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export default function AuctionCard({
  image,
  title,
  category,
  href,
  currentBid,
  timeLeft,
  bids = 0,
  description = "Excellent condition product",
  condition = "Like New",
  status,
  auctionProductId,
  startingBid = 0,
  bidIncrement = 100,
  highestBidAmount = 0,
  onBidPlaced,
}: RefinedAuctionCardProps) {
  const { status: authStatus } = useSession();
  const queryClient = useQueryClient();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [smartBidModalOpen, setSmartBidModalOpen] = useState(false);
  const [customBidAmount, setCustomBidAmount] = useState("");
  const [queuedBid, setQueuedBid] = useState<number | null>(null);

  const [now, setNow] = useState(() => Date.now());

  const profileQuery = useQuery({
    queryKey: dashboardKeys.profile,
    queryFn: getMyProfile,
    enabled: authStatus === "authenticated",
    staleTime: 60_000,
  });

  const hasPaymentMethod = Boolean(profileQuery.data?.hasDefaultPaymentMethod);

  useEffect(() => {
    if (status !== "active" || !timeLeft) return;
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [status, timeLeft]);

  const getTimeLeftDisplay = () => {
    if (status !== "active" || !timeLeft) {
      return timeLeft || "Live Now";
    }
    const targetTime = new Date(timeLeft).getTime();
    if (isNaN(targetTime)) {
      return timeLeft;
    }
    const diff = targetTime - now;
    if (diff <= 0) {
      return "Ended";
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const bidMutation = useMutation({
    mutationFn: createBid,
    onSuccess: async () => {
      toast.success("Bid placed successfully.");
      if (onBidPlaced) {
        onBidPlaced();
      }
      await queryClient.invalidateQueries({
        queryKey: ["active-auction-products"],
      });
      await queryClient.invalidateQueries({
        queryKey: dashboardKeys.auctionActivity,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "We couldn't place your bid."));
    },
  });

  const minNextBid =
    highestBidAmount && highestBidAmount > 0
      ? highestBidAmount + bidIncrement
      : startingBid;

  async function submitBidAmount(amount: number) {
    if (!auctionProductId) return;
    await bidMutation.mutateAsync({
      auctionProductId,
      amount,
    });
  }

  async function handleBidSubmit(amount: number) {
    if (authStatus !== "authenticated") {
      setAuthModalOpen(true);
      return;
    }

    if (!hasPaymentMethod) {
      setQueuedBid(amount);
      setPaymentDialogOpen(true);
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid bid amount.");
      return;
    }

    if (amount < minNextBid) {
      toast.error(`Minimum next bid is $${minNextBid}.`);
      return;
    }

    setQueuedBid(null);
    await submitBidAmount(amount);
  }

  const handleMaxBidClick = async () => {
    await handleBidSubmit(minNextBid);
  };

  const handleSmartBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(customBidAmount);
    if (!amount || isNaN(amount)) {
      toast.error("Please enter a valid number.");
      return;
    }
    if (amount < minNextBid) {
      toast.error(`Minimum next bid is $${minNextBid}.`);
      return;
    }
    setSmartBidModalOpen(false);
    await handleBidSubmit(amount);
  };

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300">
        {/* Visual Window Container with Gradient Tinted Background */}
        <Link
          href={href}
          className="relative flex aspect-square w-full items-center justify-center p-6 cursor-pointer"
        >
          <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Badge indicator based on status */}
          {status === "active" ? (
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 px-2.5 py-1 text-[9px] font-black tracking-widest text-[#10B981] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              ACTIVE
            </div>
          ) : (
            <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg bg-orange-50 border border-orange-200/80 px-2.5 py-1 text-[9px] font-black tracking-widest text-orange-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              AUCTION
            </div>
          )}
        </Link>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-5">
          {/* Main Info Blocks */}
          <div className="mb-4 flex-1">
            <Link href={href}>
              <h3 className="line-clamp-1 text-base md:text-lg font-extrabold text-slate-900 transition-colors duration-200 group-hover:text-[#FF6B00] cursor-pointer">
                {title}
              </h3>
            </Link>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-extrabold uppercase tracking-wider">
                {category}
              </span>
              {condition && (
                <span className="inline-block px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-[9px] font-extrabold uppercase tracking-wider">
                  {condition}
                </span>
              )}
            </div>

            <p className="mt-3 line-clamp-2 text-xs md:text-sm text-slate-500 font-normal leading-relaxed">
              {description}
            </p>
          </div>

          {/* Data Matrix Separator */}
          <div className="mb-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-[9px] font-extrabold tracking-wider uppercase text-slate-400">
                {status === "active" ? "Current Bid" : "Reserve Price"}
              </p>
              <h4 className="mt-1 text-lg font-black text-slate-900 tracking-tight">
                {currentBid}
              </h4>
            </div>

            <div className="text-right">
              <p className="text-[9px] font-extrabold tracking-wider uppercase text-slate-400">
                Time Left
              </p>
              <h4 className="mt-1 text-xs md:text-sm font-extrabold text-[#FF6B00] flex items-center gap-1.5 justify-end">
                <svg
                  className="w-3.5 h-3.5 text-[#FF6B00] animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                {getTimeLeftDisplay()}
              </h4>
            </div>
          </div>

          {/* Actions */}
          {status === "active" ? (
            <div className="grid grid-cols-2 gap-2 w-full mt-auto">
              <button
                onClick={() => setSmartBidModalOpen(true)}
                disabled={bidMutation.isPending}
                className="w-full bg-[#FF6B00] hover:bg-[#E05E00] text-white py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 active:scale-[0.97] hover:shadow-lg hover:shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                Smart Bid
              </button>
              <button
                onClick={handleMaxBidClick}
                disabled={bidMutation.isPending}
                className="w-full border border-slate-200 hover:border-[#FF6B00] text-slate-700 hover:text-[#FF6B00] bg-white py-3 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {bidMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Max Bid"
                )}
              </button>
            </div>
          ) : (
            <Link href={href} className="block w-full mt-auto">
              <button className="w-full rounded-xl bg-[#FF6B00] py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-[#E05E00] active:scale-[0.97] shadow-sm hover:shadow-lg hover:shadow-orange-500/10">
                View Auction Product
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Modals & Dialogs */}
      <AuthRequiredModal open={authModalOpen} onOpenChange={setAuthModalOpen} />

      <PaymentMethodDialog
        open={paymentDialogOpen}
        onOpenChange={(nextOpen) => {
          setPaymentDialogOpen(nextOpen);
          if (!nextOpen) {
            setQueuedBid(null);
          }
        }}
        title="Save your card before bidding"
        description="You need a default payment method on file before the system can accept your bid for this lot."
        onSuccess={async () => {
          const refreshedProfile = await profileQuery.refetch();
          if (!refreshedProfile.data?.hasDefaultPaymentMethod) {
            toast.error("Your account is not marked as payment-ready.");
            return;
          }
          if (queuedBid != null) {
            const bidVal = queuedBid;
            setQueuedBid(null);
            await submitBidAmount(bidVal);
          }
        }}
      />

      <Dialog open={smartBidModalOpen} onOpenChange={setSmartBidModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Place Smart Bid
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 mt-1">
              Enter your custom bid amount for{" "}
              <strong className="text-slate-700">{title}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSmartBidSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="smart-bid"
                className="text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                Your Custom Bid ($)
              </label>
              <Input
                id="smart-bid"
                type="number"
                min={minNextBid}
                step="0.01"
                placeholder={`Enter at least ${minNextBid}`}
                value={customBidAmount}
                onChange={(e) => setCustomBidAmount(e.target.value)}
                className="w-full h-12 rounded-xl border-slate-200 px-4 focus:ring-[#FF6B00] text-lg font-semibold"
                required
              />
              <p className="text-[11px] text-slate-400">
                Minimum required bid:{" "}
                <strong className="text-slate-600">${minNextBid}</strong>
              </p>
            </div>
            <DialogFooter className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setSmartBidModalOpen(false)}
                className="flex-1 h-12 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-12 rounded-xl bg-[#FF6B00] text-sm font-bold text-white hover:bg-[#E05E00] transition duration-200 flex items-center justify-center gap-1"
              >
                {bidMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Place Bid"
                )}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
