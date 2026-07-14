"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Lock,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { AuctionOutlineButton, AuctionPrimaryButton } from "./auction-buttons";
import { AuctionProductCard } from "./auction-product-card";

// --- API Schema Configuration Match ---
interface ProductImage {
  public_id: string;
  url: string;
}

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
  images: ProductImage[];
  totalReview: number;
  type: string;
  color: string[];
  quantity: number;
  averageReview: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductDetailsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: ProductDetails;
}

export default function AuctionProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id || params?.productId;
  
  // Interactive state mapping
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // --- Real TanStack Query Hook integration matching specifications ---
  const { data: response, isLoading, isError } = useQuery<ProductDetailsResponse>({
    queryKey: ["productDetails", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID parameters missing.");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`
      );
      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to fetch product details.");
      }
      return result;
    },
    enabled: !!productId,
  });

  const product = response?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9fc]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#003da5] border-t-transparent" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f9fc] p-4 text-center">
        <p className="text-sm font-bold text-slate-700">Failed to load auction data parameters.</p>
        <button onClick={() => router.back()} className="mt-3 text-xs text-[#003da5] font-bold hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ public_id: "placeholder", url: "/images/login.jpg" }];

  const currentDisplayImage = galleryImages[activeImageIndex]?.url;

  return (
    <main className="bg-[#f7f9fc]">
      <section className="container py-10">
        <div className="grid gap-4 grid-cols-3">
          
          {/* Left Main Dashboard View Column */}
          <div className="space-y-4 col-span-2">
            
            {/* Gallery Section Box */}
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
              </div>
              
              {/* Dynamic Image Pipeline Row mapping */}
              <div className="mt-4 grid grid-cols-6 gap-3">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image.public_id}-${index}`}
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

            {/* Core Product Information Card */}
            <div className="auction-card rounded-[8px] bg-white p-5">
              <div className="inline-flex rounded-[4px] bg-[#eef4ff] px-3 py-1 text-[11px] font-black uppercase text-[#003da5]">
                LOT #{product.inventoryId || "UNKNOWN"}
              </div>
              
              <h1 className="mt-4 max-w-[780px] text-[28px] font-bold leading-[1.2] text-[#1e293b] lg:text-[36px]">
                {product.title}
              </h1>

              {/* Specification Meta strip columns */}
              <div className="mt-5 grid gap-4 border-b border-[#dce6f5] pb-5 md:grid-cols-3">
                <div className="text-center md:border-r md:border-[#dce6f5]">
                  <div className="text-[11px] text-[#6b7280]">Reserve Track Price</div>
                  <div className="mt-1 text-[13px] font-medium text-[#374151]">
                    ${product.reservePrice?.toFixed(2)}
                  </div>
                </div>
                <div className="text-center md:border-r md:border-[#dce6f5]">
                  <div className="text-[11px] text-[#6b7280]">Category</div>
                  <div className="mt-1 text-[13px] font-medium text-[#374151]">
                    {product.category}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[11px] text-[#6b7280]">Condition State</div>
                  <div className="mt-1 text-[13px] font-medium text-[#ff6b1a] capitalize">
                    {product.condition?.replace("_", " ")}
                  </div>
                </div>
              </div>

              {/* Product Text Description Content */}
              <div className="mt-4">
                <h2 className="text-[14px] font-bold text-[#111827]">
                  Product Description
                </h2>
                <p className="mt-2 max-w-[850px] text-[13px] leading-6 text-[#6b7280]">
                  {product.description || "No description parameters generated for this context instance."}
                </p>
              </div>

              {/* Source parameters wrapper grid layouts */}
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-[8px] bg-[#eef4ff] px-4 py-4">
                  <div className="text-[12px] text-[#6b7280]">Auction Operations System</div>
                  <div className="mt-1 text-[14px] font-bold text-[#003da5] capitalize">
                    Active Blocks: {product.day} List
                  </div>
                </div>
                <div className="rounded-[8px] bg-[#eef4ff] px-4 py-4">
                  <div className="text-[12px] text-[#6b7280]">
                    Availability Context
                  </div>
                  <div className="mt-1 text-[14px] font-bold text-[#003da5] capitalize">
                    {product.inventoryStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* Extended Detail Panel Specs Sheet */}
            <div className="auction-card overflow-hidden rounded-[8px] bg-white">
              <div className="border-b border-[#dce6f5] px-5 py-3 text-[12px] font-bold text-[#003da5] uppercase tracking-wider">
                Specifications Overview
              </div>
              <div className="px-5 py-6">
                <h2 className="text-[22px] font-bold text-[#111827]">
                  Detailed Specifications
                </h2>
                <div className="mt-4 space-y-4 text-[13px] leading-6 text-[#6b7280]">
                  <p>
                    This listing tracking asset contains systematic information gathered through database properties. Review reserve price points configuration prior to bidding operations setup block execution.
                  </p>
                </div>
                
                {/* Dynamically listing table spec mapping metrics */}
                <div className="mt-6 overflow-hidden rounded-[4px] border border-[#e5edf8]">
                  <div className="grid grid-cols-[1fr_1fr] border-b border-[#e5edf8] text-[12px]">
                    <div className="bg-[#f8fbff] px-4 py-3 text-[#6b7280]">Variants Shade</div>
                    <div className="px-4 py-3 text-[#6b7280]">{product.color?.join(", ") || "None Specified"}</div>
                  </div>
                  <div className="grid grid-cols-[1fr_1fr] border-b border-[#e5edf8] text-[12px] last:border-b-0">
                    <div className="bg-[#f8fbff] px-4 py-3 text-[#6b7280]">Target Type System</div>
                    <div className="px-4 py-3 text-[#6b7280] capitalize">{product.type?.replace("_", " ")}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Bid Operation Sidebar */}
          <div className="space-y-4">
            <div className="auction-card overflow-hidden rounded-[8px] bg-white">
              <div className="border-b border-[#dce6f5] bg-[#eef4ff] px-4 py-3">
                <span className="text-[12px] font-bold text-[#0b57d0]">
                  • Live Auction
                </span>
              </div>
              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[12px] text-[#6b7280]">
                      Current Base Price
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="text-[46px] font-black leading-none text-[#111827]">
                        ${product.reservePrice}
                      </div>
                      <div className="pb-1 text-[12px] text-[#6b7280]">USD</div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[12px]">
                      <span className="text-[#6b7280]">Reviews: {product.averageReview} Stars</span>
                      <span className="rounded bg-[#d7f6e6] px-2 py-0.5 text-[#00a63f]">
                        {product.totalReview} Total Logs
                      </span>
                    </div>
                  </div>
                  <AuctionOutlineButton className="h-10 px-4 text-[12px]">
                    <Heart className="h-4 w-4" />
                    Add to Watchlist
                  </AuctionOutlineButton>
                </div>

                {/* Counter blocks mapping */}
                <div className="rounded-[8px] bg-[#eef4ff] p-4">
                  <div className="text-center text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                    Auction Target Pipeline
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {[
                      ["00", "Days"],
                      ["04", "Hours"],
                      ["32", "Mins"],
                      ["15", "Secs"],
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="rounded-[6px] bg-white px-3 py-3 text-center"
                      >
                        <div className="text-[22px] font-bold text-[#111827]">
                          {value}
                        </div>
                        <div className="mt-1 text-[10px] font-bold uppercase text-[#6b7280]">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[8px] border border-[#f7d288] bg-[#fff9e9] px-4 py-3 text-[12px] text-[#b66500]">
                  Card verification required before bidding. A temporary $1 hold will be placed to verify your account.
                </div>

                <AuctionPrimaryButton className="h-11 w-full text-[13px]">
                  Quick Bid: ${(product.reservePrice + 25).toFixed(2)}
                </AuctionPrimaryButton>

                <div className="flex gap-2">
                  <div className="flex h-11 flex-1 items-center rounded-[4px] border border-[#dce6f5] bg-white px-3 text-[13px] text-[#6b7280]">
                    $ Enter max bid
                  </div>
                  <AuctionOutlineButton className="h-11 px-4 text-[12px]">
                    Set Max Bid
                  </AuctionOutlineButton>
                </div>

                {/* Safety verification icons grid bottom section */}
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
                    Guaranteed
                  </div>
                </div>
              </div>
            </div>

            {/* Live activity log container stack layout fallback placeholder inside structure */}
            <div className="auction-card overflow-hidden rounded-[8px] bg-white">
              <div className="flex items-center justify-between border-b border-[#dce6f5] bg-[#f8fbff] px-4 py-3">
                <span className="text-[14px] font-bold text-[#111827]">
                  Live Bid Activity
                </span>
                <span className="text-[11px] text-[#6b7280]">Active Listing</span>
              </div>
              <div className="p-4 text-center text-[12px] text-slate-400">
                Bid metrics synchronized securely with target block.
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}