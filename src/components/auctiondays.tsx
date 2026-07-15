"use client";

import { Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type AuctionDay = {
  day: string;
  date: string;
  auctionCount: number;
};

type AuctionDaysResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    availableDays: AuctionDay[];
    selectedDay: AuctionDay | null;
    auctions: unknown[] | null;
  };
};

export default function AuctionDays() {
  const { data, isLoading, isError } = useQuery<AuctionDaysResponse>({
    queryKey: ["auctionDays"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auctions/by-day`);
      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to fetch auction days.");
      }

      return result;
    },
  });

  const auctionDays = data?.data.availableDays || [];

  return (
    <section className="bg-white py-16">
      <div className="mx-40 px-6">
        <h2 className="mb-12 text-center text-4xl font-bold uppercase text-gray-900 lg:text-5xl">
          Auction Days
        </h2>

        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[74px] w-[220px] animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-sm font-medium text-red-500">
            Auction day data is not available right now.
          </div>
        ) : auctionDays.length === 0 ? (
          <div className="text-center text-sm font-medium text-slate-500">
            No auction days are currently available.
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {auctionDays.map((item) => (
              <button
                key={`${item.day}-${item.date}`}
                type="button"
                className="flex items-center gap-4 rounded-lg border border-black/20 bg-white px-4 py-4 transition-all duration-300 hover:border-orange-500 hover:bg-orange-50 hover:shadow-lg"
                title={`${item.auctionCount} auctions`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded bg-orange-500">
                  <Calendar className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>

                <div className="text-left">
                  <span className="block text-xl font-semibold uppercase text-[#0F172A]">
                    {item.day}
                  </span>
                  <span className="block text-xs font-medium text-slate-500">
                    {item.auctionCount} auctions
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
