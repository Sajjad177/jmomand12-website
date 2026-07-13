"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

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
  manufacturer: string;
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

interface ClosedAuctionItem {
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

interface ClosedAuctionResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: ClosedAuctionItem[];
  meta: MetaData;
}

export default function ClosedAuctions() {
  // Fetch Closed Auctions dynamic data inside TanStack useQuery
  const { data: responseData, isLoading, isError } = useQuery<ClosedAuctionResponse>({
    queryKey: ["closedAuctionsData"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auctions/closed`
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to fetch closed auctions data");
      }

      return result;
    },
  });

  const closedAuctionsList = responseData?.data || [];

  // Helper function to format ISO date to descriptive "MMM DD, YYYY" format
  const formatClosedDate = (dateString: string) => {
    try {
      const dateObj = new Date(dateString);
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <h2 className="mb-10 text-4xl font-bold text-gray-900 lg:text-5xl">
          Closed Auctions
        </h2>

        {/* Dynamic Skeleton Grid or Content Rendering */}
        {isLoading ? (
          /* --- Shadcn UI Skeleton Grid Layout matching your layout structure --- */
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-lg space-y-4">
                {/* Image Skeleton */}
                <Skeleton className="h-96 w-full rounded-t-lg" />
                
                {/* Content Box Skeleton */}
                <div className="border border-slate-100 p-5 space-y-4 rounded-b-lg">
                  <Skeleton className="h-7 w-3/4" />
                  <div className="flex justify-between items-end pt-2">
                    <div className="space-y-2 w-1/3">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="space-y-2 w-1/3 flex flex-col items-end">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500 font-medium">
            Failed to connect or pull closed campaign history.
          </div>
        ) : closedAuctionsList.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium">
            No closed auctions found in historical database records.
          </div>
        ) : (
          /* Cards Grid Layer mapped dynamically from response */
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {closedAuctionsList.map((item) => {
              // Primary product and fallback management
              const primaryProduct = item.products?.[0];
              const displayImage = primaryProduct?.images?.[0]?.url || "/closed.png";
              const displayTitle = item.title || primaryProduct?.title || "Untitled Auction";
              const displayBid = primaryProduct?.reservePrice ? `$${primaryProduct.reservePrice.toFixed(2)}` : "$0.00";
              const displayClosedDate = formatClosedDate(item.endsAt);

              return (
                <div key={item._id} className="overflow-hidden rounded-lg">
                  {/* Image wrapper block container */}
                  <div className="relative h-96 overflow-hidden">
                    <Image
                      src={displayImage}
                      alt={displayTitle}
                      fill
                      className="object-cover transition duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />

                    {/* Overlay badge layer */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="-rotate-12 rounded-lg bg-red-600 px-5 py-2">
                        <span className="text-base font-black text-white">
                          Closed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content block descriptors */}
                  <div className="space-y-5 rounded-b-lg border border-slate-200 bg-white p-5">
                    <h3 className="line-clamp-1 text-2xl font-semibold text-gray-900" title={displayTitle}>
                      {displayTitle}
                    </h3>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-base text-gray-500">Winning Bid</p>
                        <h4 className="mt-2 text-lg font-bold text-gray-900">
                          {displayBid}
                        </h4>
                      </div>

                      <div className="text-right">
                        <p className="text-base text-gray-500">Closed Date</p>
                        <h4 className="mt-2 text-base font-semibold text-gray-500">
                          {displayClosedDate}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}