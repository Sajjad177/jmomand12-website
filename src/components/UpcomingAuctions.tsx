"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import AuctionCard from "./Auction/auction-card";

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

// --- API Interfaces Matching Your Upcoming Auction Payload ---
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
  createdAt: string;
  updatedAt: string;
}

interface PickupSchedule {
  startDate: string;
  endDate: string;
  dailyStartTime: string;
  dailyEndTime: string;
  durationInDays: number;
}

interface UpcomingAuctionItem {
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

export interface UpcomingAuctionResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: UpcomingAuctionItem[]; // API সরাসরি অ্যারে রিটার্ন করছে
  meta?: MetaData;
}

export default function UpcomingAuctions() {
  // Fetching Upcoming Auctions via TanStack useQuery
  const {
    data: responseData,
    isLoading,
    isError,
  } = useQuery<UpcomingAuctionResponse>({
    queryKey: ["upcomingAuctionsData"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auctions/upcoming`,
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to fetch upcoming auctions data"
        );
      }

      return result;
    },
  });

  const upcomingAuctionsList = responseData?.data || [];

  // Format upcoming startsAt date cleanly (e.g., "Oct 28 • 10:00 AM")
  const formatStartDate = (startsAtStr: string) => {
    try {
      const date = new Date(startsAtStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).replace(",", " •");
    } catch {
      return "Coming Soon";
    }
  };

  return (
    <section className="bg-[#F8FAFC] py-20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div id="upcomming" className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
              Future Marketplace
            </p>

            <h2 className="text-4xl font-bold text-slate-900 lg:text-5xl">
              Upcoming Auctions
            </h2>

            <p className="mt-4 text-lg text-slate-500">
              Get a sneak peek at our next liquidation event. Set alerts for laptops, 
              smartphones, and premium appliances.
            </p>
          </div>

          <Link
            href="/category"
            className="inline-flex w-fit items-center rounded bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
          >
            View All
          </Link>
        </div>

        {/* Loading / Error / Data Render States */}
        {isLoading ? (
          /* --- Active Auction style Skeleton Grid Layout --- */
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-4"
              >
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
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
            Failed to connect or pull upcoming marketplace data.
          </div>
        ) : upcomingAuctionsList.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium">
            No upcoming auctions scheduled right now. Check back soon!
          </div>
        ) : (
          /* Rendered Grid using same AuctionCard layout */
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {upcomingAuctionsList.map((auction) => {
              // Extracting data properties carefully from the products array array
              const primaryProduct = auction.products?.[0];
              const displayImage =
                primaryProduct?.images?.[0]?.url ||
                "/img/auctions/placeholder.png";
              
              const displayTitle =
                auction.title || primaryProduct?.title || "Untitled Auction";
              
              const displayCategory =
                primaryProduct?.category || "General Liquidation";
              
              const displayStartingPrice = primaryProduct?.reservePrice
                ? `$${primaryProduct.reservePrice}`
                : "TBD";

              return (
                <AuctionCard
                  key={auction._id}
                  href={`/category?auctionId=${encodeURIComponent(auction._id)}&status=upcoming_auction`}
                  image={displayImage}
                  title={displayTitle}
                  category={displayCategory}
                  bids={0}
                  currentBid={displayStartingPrice}
                  timeLeft={formatStartDate(auction.startsAt)} 
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
