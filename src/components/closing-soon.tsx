"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

type ClosingSoonLot = {
  auctionProductId: string;
  title: string;
  image: string | null;
};

type ClosingSoonAuction = {
  _id: string;
  title: string;
  endsAt: string;
  totalLots: number;
  summary: {
    highestBidAmount: number;
    highestBidder: {
      firstName: string;
      lastName: string;
    } | null;
    mostBidsCount: number;
    mostBiddersCount: number;
  };
  highValueLots: ClosingSoonLot[];
  mostBidLots: ClosingSoonLot[];
};

type ClosingSoonResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: ClosingSoonAuction[];
};

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

const formatClosingDate = (endsAt: string) =>
  new Date(endsAt).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
    timeZoneName: "short",
  });

const buildFooterText = (totalLots: number) => {
  const moreLots = Math.max(totalLots - 9, 0);
  return `+${moreLots} more lots available`;
};

export default function ClosingSoon() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const { data } = useQuery<ClosingSoonResponse>({
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
    <section className="bg-[#0D3B8E] py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="mb-10 text-4xl font-bold text-white lg:text-5xl">
          Closing Soon
        </h2>

        <div className="grid gap-8 lg:grid-cols-2">
          {auctions.map((auction) => {
            const countdown = formatCountdown(auction.endsAt, now);
            const highestBidder = auction.summary?.highestBidder
              ? `${auction.summary.highestBidder.firstName} ${auction.summary.highestBidder.lastName}`
              : null;

            return (
              <div
                key={auction._id}
                className="rounded-xl bg-white p-6 shadow-lg"
              >
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {auction.title}
                    </h3>

                    <p className="mt-3 text-gray-500">
                      {formatClosingDate(auction.endsAt)}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    {[
                      { value: countdown.d, label: "D" },
                      { value: countdown.h, label: "H" },
                      { value: countdown.m, label: "M" },
                      { value: countdown.s, label: "S" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="text-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white font-semibold">
                            {item.value}
                          </div>

                          <p className="mt-2 text-xs font-bold tracking-[4px] text-orange-500">
                            {item.label}
                          </p>
                        </div>

                        {index !== 3 && (
                          <span className="pb-6 text-xl text-[#0D3B8E]">:</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="mb-4 text-sm font-bold uppercase text-orange-500">
                    High Value
                  </h4>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
                    {auction.highValueLots?.map((product) => (
                      <div
                        key={product.auctionProductId}
                        className="overflow-hidden rounded-lg border border-[#0D3B8E]"
                        title={
                          highestBidder && auction.summary.highestBidAmount > 0
                            ? `${product.title} • ${highestBidder} • $${auction.summary.highestBidAmount}`
                            : product.title
                        }
                      >
                        <Image
                          src={product.image || "/product.jpg"}
                          alt={product.title}
                          width={80}
                          height={80}
                          className="h-20 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="mb-4 text-sm font-bold uppercase text-orange-500">
                    Most Bids
                  </h4>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
                    {(auction.mostBidLots ?? []).map((product) => (
                      <div
                        key={product.auctionProductId}
                        className="overflow-hidden rounded-lg border border-[#0D3B8E]"
                        title={
                          auction.summary.mostBidsCount > 0
                            ? `${product.title} • ${auction.summary.mostBidsCount} bids • ${auction.summary.mostBiddersCount} bidders`
                            : product.title
                        }
                      >
                        <Image
                          src={product.image || "/product.jpg"}
                          alt={product.title}
                          width={80}
                          height={80}
                          className="h-20 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    href={`/category?auctionId=${encodeURIComponent(auction._id)}&status=ending_soon`}
                    className="font-medium text-orange-500 transition hover:text-orange-600"
                  >
                    {buildFooterText(auction.totalLots)}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
