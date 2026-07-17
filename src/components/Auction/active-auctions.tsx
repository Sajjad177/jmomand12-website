"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import AuctionCard from "./auction-card";

// --- Shadcn UI Skeleton Component Inline Implementation ---
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80 ${className}`}
      {...props}
    />
  );
}

// --- API Interfaces Definition matching your response structural mapping ---
interface AuctionProductImage {
  public_id: string;
  url: string;
}

interface AuctionProduct {
  _id: string;
  inventoryId: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  day: string;
  reservePrice: number;
  inventoryStatus: string;
  images: AuctionProductImage[];
  totalReview: number;
  type: string;
  color: string[];
  quantity: number;
  averageReview: number;
}

interface PickupSchedule {
  startDate: string;
  endDate: string;
  dailyStartTime: string;
  dailyEndTime: string;
  durationInDays: number;
}

interface AuctionItem {
  _id: string;
  auctionId: string;
  products: AuctionProduct[];
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  durationInDays: number;
  status: string;
  pickupSchedule: PickupSchedule;
  createdAt: string;
  updatedAt: string;
}

interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ActiveAuctionResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    meta: MetaData;
    data: AuctionItem[];
  };
}

interface LiveAuctionProductsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: AuctionProduct[];
  meta: MetaData;
}

export default function ActiveAuctions() {
  // Fetching Active Auctions via TanStack useQuery
  const {
    data: responseData,
    isLoading,
    isError,
  } = useQuery<LiveAuctionProductsResponse>({
    queryKey: ["liveAuctionProducts", 1, 12],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/browse?status=live_auction&page=1&limit=12`,
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to fetch live auction products",
        );
      }

      return result;
    },
  });

  const products = responseData?.data || [];

  return (
    <section className="bg-[#F8FAFC] py-20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
              Live Marketplace
            </p>

            <h2 className="text-4xl font-bold text-slate-900 lg:text-5xl">
              Active Auctions
            </h2>

            <p className="mt-4 text-lg text-slate-500">
              Discover trending liquidation auctions, electronics, furniture,
              appliances, tools and much more.
            </p>
          </div>

          <Link
            href="/category"
            className="inline-flex w-fit items-center rounded bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
          >
            View All
          </Link>
        </div>

        {/* Dynamic Skeleton and Error UI Block states tracking inside same grid template */}
        {isLoading ? (
          /* --- Shadcn UI Skeleton Grid Layout matching your AuctionCard structure --- */
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-4"
              >
                {/* Image Placeholder */}
                <Skeleton className="h-48 w-full rounded-lg" />

                {/* Category & Title Placeholders */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-5 w-3/4" />
                </div>

                {/* Footer Meta Data Placeholders */}
                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                  <div className="space-y-1 w-1/3">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-6 w-1/4 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500 font-medium">
            Failed to connect or pull live marketplace streaming data.
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium">
            No live active auctions right now. Check back soon!
          </div>
        ) : (
          /* Auction Grid Layer renders if mapping length exists */
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => {
              const displayImage =
                product.images?.[0]?.url || "/img/auctions/placeholder.png";
              const displayReservePrice = `$${product.reservePrice}`;

              return (
                <AuctionCard
                  key={product._id}
                  href={`/auction-details/${product._id}`}
                  image={displayImage}
                  title={product.title || "Untitled Auction"}
                  category={product.category || "General Marketplace"}
                  bids={0}
                  currentBid={displayReservePrice}
                  timeLeft="Live Now"
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
