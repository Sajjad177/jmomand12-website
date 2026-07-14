"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Lock, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { AuctionOutlineButton } from "./auction-buttons";
import SimilarAuctions from "./Similar-Auctions";

// --- Shadcn UI Skeleton loader helper ---
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80 ${className}`}
      {...props}
    />
  );
}

// --- Dynamic Interfaces matching updated backend format ---
interface ProductDetails {
  _id: string;
  inventoryId: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  day: string;
  reservePrice: number;
  inventoryStatus: string;
  images: {
    public_id: string;
    url: string;
  }[];
  totalReview: number;
  type: string;
  color: string[];
  quantity: number;
  averageReview: number;
  createdAt: string;
  updatedAt: string;
}

interface AuctionProductRelation {
  _id: string; // This is the unique ID for this specific auction-product connection
  auctionId: string;
  productId: ProductDetails;
  startingBid: number;
  reservePrice: number;
  bidIncrement: number;
  status: string;
  highestBid: {
    amount: number;
    bidder?: string; // Opt
  };
  paymentStatus: string;
  pickupStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface AuctionDetailsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: AuctionProductRelation[];
}

export function AuctionsDetails() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken;

  // Extract ID from routing params (Supports fallback dynamic names: 'id' or 'auctionId')
  const auctionId = params?.id || params?.auctionId;

  // Selected state tracking for multi-product lists
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [customBidAmount, setCustomBidAmount] = useState<string>("");

  // Countdown duration parameters tracker
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "04",
    mins: "32",
    secs: "15",
  });

  // --- Fetch Auction Details API ---
  const { data: response, isLoading, isError } = useQuery<AuctionDetailsResponse>({
    queryKey: ["auctionDetails", auctionId],
    queryFn: async () => {
      if (!auctionId) throw new Error("No Auction ID context detected.");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auction-products/${auctionId}`
      );
      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to fetch auction products.");
      }
      return result;
    },
    enabled: !!auctionId,
  });

  const auctionProductsList = response?.data || [];
  const currentAuctionItem = auctionProductsList[activeIndex];
  const activeProduct = currentAuctionItem?.productId;

  // Dummy fallback timer sequence setup logic
  useEffect(() => {
    const interval = setInterval(() => {
      // Setup dynamic interval decrement fallback if EndsAt is absent
      setTimeLeft((prev) => {
        const secsNum = parseInt(prev.secs) - 1;
        if (secsNum >= 0) {
          return { ...prev, secs: secsNum.toString().padStart(2, "0") };
        }
        return { ...prev, secs: "59" };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Post Bid Hook Mutation ---
  const placeBidMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!token) throw new Error("Please log in to submit a bid.");
      if (!currentAuctionItem) throw new Error("Selected product item is invalid.");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auctions/${auctionId}/bid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            auctionProductId: currentAuctionItem._id, // References unique auctionId-productId relation string
            productId: activeProduct?._id,
            bidAmount: amount,
          }),
        }
      );

      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to register bid.");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Congratulations! Your bid has been submitted successfully.");
      setCustomBidAmount("");
      queryClient.invalidateQueries({ queryKey: ["auctionDetails", auctionId] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      toast.error(err.message || "Bid submission failed.");
    },
  });

  const handlePlaceBid = (amount: number) => {
    if (!amount || isNaN(amount)) {
      toast.error("Please insert a valid bid amount.");
      return;
    }

    const minRequired = currentAuctionItem?.highestBid?.amount > 0 
      ? currentAuctionItem.highestBid.amount + currentAuctionItem.bidIncrement
      : currentAuctionItem?.startingBid || 0;

    if (amount < minRequired) {
      toast.error(`Minimum bid allowed is $${minRequired.toFixed(2)}`);
      return;
    }

    placeBidMutation.mutate(amount);
  };

  if (isLoading) {
    return (
      <main className="bg-[#f7f9fc] min-h-screen py-10">
        <div className="container mx-auto px-4 space-y-8">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-[520px] w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-[450px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || auctionProductsList.length === 0 || !currentAuctionItem || !activeProduct) {
    return (
      <main className="bg-[#f7f9fc] min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">No Active Products Found</h2>
        <p className="text-sm text-gray-500 mt-2">Could not track down live details parameters or api backend is down.</p>
        <button onClick={() => router.back()} className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </main>
    );
  }

  // Gallery calculation context variables
  const productImages = activeProduct.images || [];
  const displayMainImg = productImages[activeImageIndex]?.url || "/images/placeholder.png";

  // Bid logic mapping values
  const highestCurrentBid = currentAuctionItem.highestBid?.amount || 0;
  const currentBasePrice = highestCurrentBid > 0 ? highestCurrentBid : currentAuctionItem.startingBid;
  const incrementStep = currentAuctionItem.bidIncrement || 10;
  const suggestedQuickBid = currentBasePrice + incrementStep;

  return (
    <main className="bg-[#f7f9fc] min-h-screen">
      <section className="container mx-auto px-4 py-10">
        
        {/* Navigation Indicator Row */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Active Stream
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN: Media Gallery, Info Block, Spec sheets */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Image Gallery Card */}
            <div className="auction-card rounded-[8px] border border-[#dce6f5] bg-white p-6 shadow-sm">
              <div className="relative h-[520px] w-full overflow-hidden rounded-[4px] bg-white">
                <Image
                  src={displayMainImg}
                  alt={activeProduct.title || "Product image"}
                  fill
                  className="object-contain"
                  priority
                />
                <div className="absolute bottom-4 right-4 rounded-[8px] bg-[#eef4ff] px-4 py-2 text-[12px] font-bold text-[#111827]">
                  {productImages.length > 0 ? `${activeImageIndex + 1}/${productImages.length}` : "0/0"}
                </div>
              </div>
              
              {/* Thumbnail Gallery Row */}
              {productImages.length > 1 && (
                <div className="mt-4 grid grid-cols-6 gap-3">
                  {productImages.map((image, index) => (
                    <div
                      key={image.public_id}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative h-[56px] cursor-pointer overflow-hidden rounded-[8px] border p-2 transition-all ${
                        index === activeImageIndex
                          ? "border-2 border-[#003da5] opacity-100"
                          : "border-[#dce6f5] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={image.url} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Switcher Panel - If Auction Contains Multiple Items */}
            {auctionProductsList.length > 1 && (
              <div className="p-5 rounded-[8px] border border-orange-100 bg-orange-50/50 shadow-sm">
                <h3 className="text-xs font-bold text-[#ff6b1a] uppercase tracking-wider mb-3">
                  Select Product to Bid Individually ({auctionProductsList.length} Items Available):
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {auctionProductsList.map((item, index) => (
                    <button
                      key={item._id}
                      onClick={() => setActiveIndex(index)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        index === activeIndex
                          ? "border-[#003da5] bg-[#eef4ff]/70 ring-1 ring-[#003da5]"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="relative h-12 w-12 rounded border shrink-0 bg-white overflow-hidden">
                        <Image
                          src={item.productId?.images?.[0]?.url || "/images/placeholder.png"}
                          alt={item.productId?.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.productId?.title}</p>
                        <p className="text-[10px] text-slate-500 capitalize mt-0.5">
                          {item.productId?.category} • Current Bid: ${item.highestBid?.amount || item.startingBid}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Title & Condition Card */}
            <div className="auction-card rounded-[8px] border border-[#dce6f5] bg-white p-5 shadow-sm">
              <h1 className="mt-4 max-w-[780px] text-[24px] font-bold leading-[1.25] text-[#1e293b] lg:text-[32px]">
                {activeProduct.title}
              </h1>

              <div className="mt-5 grid grid-cols-3 gap-4 border-b border-[#dce6f5] pb-5 text-center">
                <div className="border-r border-[#dce6f5]">
                  <div className="text-[11px] text-[#6b7280]">Starting Bid</div>
                  <div className="mt-1 text-[14px] font-semibold text-[#374151]">
                    ${currentAuctionItem.startingBid}
                  </div>
                </div>
                <div className="border-r border-[#dce6f5]">
                  <div className="text-[11px] text-[#6b7280]">Category</div>
                  <div className="mt-1 text-[14px] font-semibold text-[#374151] capitalize">
                    {activeProduct.category}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#6b7280]">Condition</div>
                  <div className="mt-1 text-[14px] font-bold text-[#ff6b1a] capitalize">
                    {activeProduct.condition.replace("_", " ")}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-[14px] font-bold text-[#111827]">
                  Product Description
                </h2>
                <p className="mt-2 text-[13px] leading-6 text-[#6b7280]">
                  {activeProduct.description || "No description template assigned."}
                </p>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-[8px] bg-[#eef4ff] px-4 py-4">
                  <div className="text-[12px] text-[#6b7280]">Product Status</div>
                  <div className="mt-1 text-[14px] font-bold text-[#003da5] capitalize">
                    {activeProduct.inventoryStatus.replace("_", " ")}
                  </div>
                </div>
                <div className="rounded-[8px] bg-[#eef4ff] px-4 py-4">
                  <div className="text-[12px] text-[#6b7280]">
                    Verified Color Way
                  </div>
                  <div className="mt-1 text-[14px] font-bold text-[#003da5]">
                    {activeProduct.color?.join(", ") || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Specifications Card */}
            <div className="auction-card overflow-hidden rounded-[8px] border border-[#dce6f5] bg-white shadow-sm">
              <div className="border-b border-[#dce6f5] px-5 py-3 text-[12px] font-bold text-[#003da5]">
                Specifications
              </div>
              <div className="px-5 py-6">
                <h2 className="text-[22px] font-bold text-[#111827]">
                  Detailed Inventory Specs
                </h2>
                
                {/* Specs Table */}
                <div className="mt-6 overflow-hidden rounded-[4px] border border-[#e5edf8]">
                  <div className="grid grid-cols-2 border-b border-[#e5edf8] text-[12px]">
                    <div className="bg-[#f8fbff] px-4 py-3 font-medium text-[#6b7280]">
                      Inventory ID
                    </div>
                    <div className="px-4 py-3 font-mono text-[#111827]">{activeProduct.inventoryId}</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#e5edf8] text-[12px]">
                    <div className="bg-[#f8fbff] px-4 py-3 font-medium text-[#6b7280]">
                      Bid Increment Structure
                    </div>
                    <div className="px-4 py-3 text-[#111827] font-semibold">${currentAuctionItem.bidIncrement} Min Step</div>
                  </div>
                  <div className="grid grid-cols-2 text-[12px]">
                    <div className="bg-[#f8fbff] px-4 py-3 font-medium text-[#6b7280]">
                      Verification Code
                    </div>
                    <div className="px-4 py-3 font-semibold text-emerald-600">Passed QC Check</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar live bidding mechanisms */}
          <div className="space-y-4">
            <div className="auction-card overflow-hidden rounded-[8px] border border-[#dce6f5] bg-white shadow-sm">
              <div className="border-b border-[#dce6f5] bg-[#eef4ff] px-4 py-3">
                <span className="text-[12px] font-bold text-[#0b57d0] flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#0b57d0] inline-block animate-pulse"></span>
                  Bidding on: {activeProduct.title}
                </span>
              </div>
              
              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[12px] text-[#6b7280]">Current Highest Bid</div>
                    <div className="flex items-end gap-2 mt-1">
                      <div className="text-[36px] font-black leading-none text-[#111827]">
                        ${currentBasePrice.toFixed(2)}
                      </div>
                      <div className="pb-1 text-[12px] font-bold text-[#6b7280]">USD</div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span>Reserve Price: ${currentAuctionItem.reservePrice}</span>
                    </div>
                  </div>
                  <AuctionOutlineButton className="h-9 px-3 text-[11px] font-medium border-[#dce6f5] flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 text-[#6b7280]" />
                    Watch
                  </AuctionOutlineButton>
                </div>

                {/* Countdown Timer Wrapper */}
                <div className="rounded-[8px] bg-[#eef4ff] p-4">
                  <div className="text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                    Auction Ends In
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {[
                      [timeLeft.days, "Days"],
                      [timeLeft.hours, "Hours"],
                      [timeLeft.mins, "Mins"],
                      [timeLeft.secs, "Secs"],
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="rounded-[6px] bg-white py-2.5 text-center shadow-sm"
                      >
                        <div className="text-[20px] font-bold text-[#111827] leading-tight">
                          {value}
                        </div>
                        <div className="text-[9px] font-bold uppercase text-[#9ca3af] mt-0.5">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[8px] border border-[#f7d288] bg-[#fff9e9] px-4 py-3 text-[12px] leading-5 text-[#b66500]">
                  Increments structure requires dynamic step values of ${currentAuctionItem.bidIncrement} above current bid parameters.
                </div>

                {/* Quick Bid Button */}
                <button
                  type="button"
                  onClick={() => handlePlaceBid(suggestedQuickBid)}
                  disabled={placeBidMutation.isPending}
                  className="h-11 w-full text-[13px] font-bold bg-[#ff6b1a] hover:bg-[#e55a00] text-white rounded-[4px] transition-colors flex items-center justify-center gap-1.5"
                >
                  {placeBidMutation.isPending ? "Processing..." : `Quick Bid: $${suggestedQuickBid.toFixed(2)}`}
                </button>

                {/* Custom Bid Inputs */}
                <div className="flex gap-2">
                  <div className="flex h-11 flex-1 items-center justify-between rounded-[4px] border border-[#dce6f5] bg-white px-3 text-[13px]">
                    <input
                      type="number"
                      placeholder={`Min: $${(currentBasePrice + incrementStep).toFixed(2)}`}
                      className="w-full bg-transparent outline-none text-slate-800 text-[13px]"
                      value={customBidAmount}
                      onChange={(e) => setCustomBidAmount(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlaceBid(Number(customBidAmount))}
                    disabled={placeBidMutation.isPending || !customBidAmount}
                    className="h-11 px-4 text-[12px] font-bold border border-[#dce6f5] hover:bg-slate-50 transition-colors rounded-[4px]"
                  >
                    Set Bid
                  </button>
                </div>

                {/* Security Badges */}
                <div className="flex items-center justify-center gap-8 pt-2 text-center text-[10px] font-bold uppercase text-[#6b7280]">
                  <div className="flex flex-col items-center">
                    <Lock className="mb-1 h-4 w-4 text-[#6b7280]" />
                    Secure
                  </div>
                  <div className="flex flex-col items-center">
                    <ShieldCheck className="mb-1 h-4 w-4 text-[#0b57d0]" />
                    Verified
                  </div>
                  <div className="flex flex-col items-center">
                    <Truck className="mb-1 h-4 w-4 text-[#fe6819]" />
                    Pickup Ready
                  </div>
                </div>
              </div>
            </div>

            {/* Product Specific Properties Information Card */}
            <div className="auction-card overflow-hidden rounded-[8px] border border-[#dce6f5] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#dce6f5] bg-[#f8fbff] px-4 py-3">
                <span className="text-[14px] font-bold text-[#111827]">
                  Product Bidding Specifications
                </span>
              </div>
              <div className="p-4 space-y-3 text-[12px] text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Starting Bid:</span>
                  <span className="font-semibold">${currentAuctionItem.startingBid}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span>Bid Step Increments:</span>
                  <span className="font-semibold text-orange-600">+${currentAuctionItem.bidIncrement}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment status:</span>
                  <span className="font-bold text-slate-700 capitalize">{currentAuctionItem.paymentStatus}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Similar Auctions Section */}
      <SimilarAuctions />
    </main>
  );
}