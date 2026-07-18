"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import AuctionCard from "./auction-card";
import { LiveAuctionProductsResponse } from "../../types/AuctionType";
import Loading from "../loading";

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
            <h2 className="text-4xl font-bold text-slate-900 lg:text-5xl">
              Active Auctions
            </h2>
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
          <Loading />
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
