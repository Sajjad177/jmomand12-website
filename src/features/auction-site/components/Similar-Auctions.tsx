"use client"
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import AuctionCard from "@/components/Auction/auction-card";
import { ActiveAuctionResponse } from "@/types/AuctionType";

const SimilarAuctions = () => {
  // Fetching Active Auctions via TanStack useQuery
  const {
    data: responseData,
  } = useQuery<ActiveAuctionResponse>({
    queryKey: ["activeAuctionsData"],

    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auctions/active`,
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to fetch active auctions data",
        );
      }

      return result;
    },
  });

  const auctionsList = responseData?.data?.data || [];

  // Time left formatting logic implementation wrapper for endsAt string
  const calculateTimeLeft = (endsAtStr: string) => {
    const total = Date.parse(endsAtStr) - Date.parse(new Date().toString());
    if (total <= 0) return "Ended";

    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);

    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[28px] md:text-[36px] font-bold text-[#1e293b]">
          Similar Auctions
        </h2>
        <div className="flex gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dce6f5] bg-white text-[#94a3b8] hover:text-[#64748b] transition-colors shadow-sm">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dce6f5] bg-white text-[#64748b] hover:bg-[#f8fbff] transition-colors shadow-sm">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {auctionsList.map((auction) => {
          // Extracting primary item context layer for card visual presentation fallback
          const primaryProduct = auction.products?.[0];
          const displayImage =
            primaryProduct?.images?.[0]?.url || "/img/auctions/placeholder.png";
          const displayTitle =
            auction.title || primaryProduct?.title || "Untitled Auction";
          const displayCategory =
            primaryProduct?.category || "General Marketplace";
          const displayReservePrice = primaryProduct?.reservePrice
            ? `$${primaryProduct.reservePrice}`
            : "N/A";

          return (
            <AuctionCard
              key={auction._id}
              href={`/category?auctionId=${encodeURIComponent(auction._id)}&status=live_auction`}
              image={displayImage}
              title={displayTitle}
              category={displayCategory}
              bids={0}
              currentBid={displayReservePrice}
              timeLeft={calculateTimeLeft(auction.endsAt)}
            />
          );
        })}
      </div>
    </section>
  );
};

export default SimilarAuctions;
