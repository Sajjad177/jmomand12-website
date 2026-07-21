"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

// --- API Types ---
interface ProductImage {
  public_id: string;
  url: string;
}

interface Product {
  _id: string;
  inventoryId: string;
  title: string;
  description: string;
  category: string;
  images: ProductImage[];
  reservePrice: number;
  inventoryStatus: string;
  auctionProductId?: string;
  currentBid?: number;
}

interface AuctionItem {
  _id: string;
  auctionId: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  status: string;
  products: Product[];
  highValueLots?: { auctionProductId: string; title: string; image: string }[];
  mostBidLots?: { auctionProductId: string; title: string; image: string }[];
}

interface ClosingSoonResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: AuctionItem[];
}

// --- Helper Functions ---
const formatCountdown = (endsAt: string, now: number) => {
  const diff = Math.max(0, new Date(endsAt).getTime() - now);
  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    d: String(days).padStart(2, "0"),
    h: String(hours).padStart(2, "0"),
    m: String(minutes).padStart(2, "0"),
    s: String(seconds).padStart(2, "0"),
  };
};

const formatClosingDate = (endsAt: string) => {
  try {
    const date = new Date(endsAt);
    const formatted = date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/New_York",
    });
    return `${formatted} ET`;
  } catch {
    return "Closing Soon";
  }
};

export default function ClosingSoon() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const { data, isLoading, isError } = useQuery<ClosingSoonResponse>({
    queryKey: ["closingSoonAuctions"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auctions/closing-soon?limit=2`,
      );
      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to fetch closing soon auctions.",
        );
      }

      return result;
    },
  });

  const auctions = data?.data || [];

  return (
    <section className="bg-[#0047BA] py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header Title */}
        <h2 className="mb-8 text-3xl font-extrabold text-white sm:text-4xl">
          Closing Soon
        </h2>

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl bg-white/20 p-6"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-white/80 py-8 font-medium">
            Failed to load closing auctions. Please check back later.
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center text-white/80 py-8 font-medium">
            No auctions closing soon at this moment.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {auctions.map((auction) => {
              const countdown = formatCountdown(auction.endsAt, now);
              const hasDays = Number(countdown.d) > 0;

              // Extract product image items
              const extractedHighValue =
                auction.highValueLots && auction.highValueLots.length > 0
                  ? auction.highValueLots
                  : (auction.products || []).slice(0, 9).map((p) => ({
                      auctionProductId: p._id,
                      title: p.title,
                      image: p.images?.[0]?.url || "/placeholder.png",
                    }));

              const extractedMostBids =
                auction.mostBidLots && auction.mostBidLots.length > 0
                  ? auction.mostBidLots
                  : (auction.products || []).slice(0, 9).map((p) => ({
                      auctionProductId: p._id,
                      title: p.title,
                      image: p.images?.[0]?.url || "/placeholder.png",
                    }));

              const totalLots = auction.products?.length || 0;
              const remainingLots = Math.max(0, totalLots - 18);

              return (
                <div
                  key={auction._id}
                  className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-xl"
                >
                  <div>
                    {/* Card Header: Title & Countdown */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                          {auction.title}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-400">
                          {formatClosingDate(auction.endsAt)}
                        </p>
                      </div>

                      {/* Timer Blocks */}
                      <div className="flex items-start gap-1 sm:gap-1.5">
                        {hasDays && (
                          <>
                            <div className="flex flex-col items-center">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5500] text-sm font-bold text-white shadow-sm sm:h-9 sm:w-9">
                                {countdown.d}
                              </div>
                              <span className="mt-1 text-[10px] font-bold text-[#FF5500]">
                                D
                              </span>
                            </div>
                            <span className="pt-1.5 font-bold text-slate-300">
                              :
                            </span>
                          </>
                        )}

                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5500] text-sm font-bold text-white shadow-sm sm:h-9 sm:w-9">
                            {countdown.h}
                          </div>
                          <span className="mt-1 text-[10px] font-bold text-[#FF5500]">
                            H
                          </span>
                        </div>

                        <span className="pt-1.5 font-bold text-slate-300">
                          :
                        </span>

                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5500] text-sm font-bold text-white shadow-sm sm:h-9 sm:w-9">
                            {countdown.m}
                          </div>
                          <span className="mt-1 text-[10px] font-bold text-[#FF5500]">
                            M
                          </span>
                        </div>

                        <span className="pt-1.5 font-bold text-slate-300">
                          :
                        </span>

                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5500] text-sm font-bold text-white shadow-sm sm:h-9 sm:w-9">
                            {countdown.s}
                          </div>
                          <span className="mt-1 text-[10px] font-bold text-[#FF5500]">
                            S
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* High Value Section */}
                    <div className="mt-6">
                      <h4 className="mb-2 text-xs font-bold tracking-wider text-[#FF5500] uppercase">
                        HIGH VALUE
                      </h4>
                      <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
                        {extractedHighValue.slice(0, 9).map((product, idx) => (
                          <div
                            key={product.auctionProductId || idx}
                            className="relative aspect-square overflow-hidden rounded-lg border border-[#C2D1E5] bg-[#E9EFF6]"
                          >
                            <Image
                              src={product.image || "/placeholder.png"}
                              alt={product.title || "Auction Item"}
                              fill
                              className="object-cover p-0.5"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Most Bids Section */}
                    <div className="mt-4">
                      <h4 className="mb-2 text-xs font-bold tracking-wider text-[#FF5500] uppercase">
                        MOST BIDS
                      </h4>
                      <div className="grid grid-cols-9 gap-1.5 sm:gap-2">
                        {extractedMostBids.slice(0, 9).map((product, idx) => (
                          <div
                            key={product.auctionProductId || idx}
                            className="relative aspect-square overflow-hidden rounded-lg border border-[#C2D1E5] bg-[#E9EFF6]"
                          >
                            <Image
                              src={product.image || "/placeholder.png"}
                              alt={product.title || "Auction Item"}
                              fill
                              className="object-cover p-0.5"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Link */}
                  <div className="mt-6 text-center">
                    <Link
                      href={`/category?auctionId=${encodeURIComponent(
                        auction._id,
                      )}&status=ending_soon`}
                      className="text-xs font-bold text-[#FF5500] transition hover:underline"
                    >
                      +{remainingLots > 0 ? remainingLots : ""} more lots
                      available
                    </Link>
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
