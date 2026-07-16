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

interface AuctionDaysProps {
  isDarkTheme?: boolean;
}

export default function AuctionDays({ isDarkTheme = true }: AuctionDaysProps) {
  const { data, isLoading, isError } = useQuery<AuctionDaysResponse>({
    queryKey: ["auctionDays"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auctions/by-day`,
      );
      const result = await res.json();

      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to fetch auction days.");
      }

      return result;
    },
  });

  const auctionDays = data?.data.availableDays || [];

  return (
    <div className="w-full">
      {/* Title */}
      <h3
        className={`mb-4 text-xs font-bold uppercase tracking-wider text-center lg:text-left ${
          isDarkTheme ? "text-blue-300" : "text-gray-500"
        }`}
      >
        Auctions by Day
      </h3>

      {isLoading ? (
        /* Skeletons mirror the mobile scroll container behavior */
        <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2 scrollbar-none lg:flex-wrap lg:grid lg:grid-cols-3 lg:overflow-visible">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`h-[60px] sm:h-[64px] min-w-[140px] sm:min-w-[160px] lg:w-full rounded-xl animate-pulse ${
                isDarkTheme ? "bg-white/10" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      ) : isError ? (
        <p
          className={`text-sm font-medium text-center lg:text-left ${isDarkTheme ? "text-red-400" : "text-red-600"}`}
        >
          Auction day data is not available right now.
        </p>
      ) : auctionDays.length === 0 ? (
        <p
          className={`text-sm font-medium text-center lg:text-left ${isDarkTheme ? "text-slate-400" : "text-gray-500"}`}
        >
          No auction days are currently available.
        </p>
      ) : (
        /*
          MOBILE: Horizontally scrolling carousel with inertia-based scroll snap.
          TABLET: Dynamic 3-column Grid.
          DESKTOP (LG+): Flex Wrap Row.
        */
        <div
          className="flex flex-nowrap overflow-x-auto gap-3.5 pb-4 px-1 -mx-4 sm:mx-0 sm:px-0 scrollbar-none snap-x snap-mandatory sm:grid sm:grid-cols-3 lg:flex lg:flex-wrap"
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE/Edge */,
            WebkitOverflowScrolling: "touch" /* Smooth Momentum on iOS */,
          }}
        >
          {/* Webkit scrollbar hiding rule fallback */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            div::-webkit-scrollbar {
              display: none !important;
            }
          `,
            }}
          />

          {auctionDays.map((item) => (
            <button
              key={`${item.day}-${item.date}`}
              type="button"
              className={`group flex items-center justify-start shrink-0 gap-3 rounded-xl border p-3.5 w-[145px] sm:w-full lg:w-auto snap-center transition-all duration-300 active:scale-95 ${
                isDarkTheme
                  ? "border-white/10 bg-white/5 hover:border-orange-500 hover:bg-orange-500/10 hover:shadow-lg hover:shadow-orange-500/5"
                  : "border-gray-200 bg-white hover:border-orange-500 hover:bg-orange-50 hover:shadow-md"
              }`}
              title={`${item.auctionCount} auctions`}
            >
              {/* Icon Container */}
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-500 transition-colors group-hover:bg-orange-50 group-hover:text-white">
                <Calendar
                  className="h-4 sm:h-4.5 w-4 sm:w-4.5"
                  strokeWidth={2.5}
                />
              </div>

              {/* Day Metadata Text */}
              <div className="text-left min-w-0">
                <span
                  className={`block text-xs sm:text-sm font-bold uppercase tracking-wide truncate ${
                    isDarkTheme ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.day}
                </span>
                <span
                  className={`block text-[10px] sm:text-[11px] font-medium truncate ${
                    isDarkTheme
                      ? "text-blue-200/60 group-hover:text-orange-300"
                      : "text-gray-500 group-hover:text-orange-600"
                  }`}
                >
                  {item.auctionCount} Auctions
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
