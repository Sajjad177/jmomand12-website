"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { UpcomingAuctionResponse } from "../types/upcomingTypes";
import Link from "next/link";

// --- Inline Skeleton Component ---
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800 ${className}`}
      {...props}
    />
  );
}

// --- API Interfaces Matching Your Payload ---

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
          result.message || "Failed to fetch upcoming auctions data",
        );
      }

      return result;
    },
  });

  const upcomingAuctionsList = responseData?.data || [];

  // Format upcoming startsAt date cleanly: "OCT 28 • 10:00 AM"
  const formatStartDate = (startsAtStr: string) => {
    try {
      const date = new Date(startsAtStr);
      const formatted = date
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .toUpperCase();

      return formatted.replace(",", " •");
    } catch {
      return "COMING SOON";
    }
  };

  return (
    <section className="bg-white py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Heading */}
        <div id="upcoming" className="mb-8">
          <h2 className="text-3xl font-bold text-[#0F172A] sm:text-4xl lg:text-5xl">
            Upcoming Auctions
          </h2>
        </div>

        {/* Loading / Error / Data Render States */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-[340px] w-full rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="py-12 text-center font-medium text-red-500">
            Failed to connect or pull upcoming marketplace data.
          </div>
        ) : upcomingAuctionsList.length === 0 ? (
          <div className="py-12 text-center font-medium text-slate-400">
            No upcoming auctions scheduled right now. Check back soon!
          </div>
        ) : (
          /* Rendered Grid */
          <div className="grid gap-6 md:grid-cols-2">
            {upcomingAuctionsList.map((auction) => {
              const primaryProduct = auction.products?.[0];
              const displayImage =
                primaryProduct?.images?.[0]?.url ||
                "/img/auctions/placeholder.png";

              return (
                <div
                  key={auction._id}
                  className="group relative flex h-[340px] sm:h-[380px] w-full flex-col justify-between overflow-hidden rounded-2xl bg-slate-900 p-6 shadow-sm transition sm:p-8"
                >
                  {/* Background Image & Gradient Overlay */}
                  <Image
                    src={displayImage}
                    alt={auction.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

                  {/* Top Blue Date Pill */}
                  <div className="relative z-10">
                    <span className="inline-block rounded-full bg-[#0A4BB3] px-4 py-1.5 text-xs font-bold tracking-wider text-white shadow-sm">
                      {formatStartDate(auction.startsAt)}
                    </span>
                  </div>

                  {/* Bottom Text Content & Action Button */}
                  <div className="relative z-10 flex flex-col items-start">
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">
                      {auction.title}
                    </h3>

                    {auction.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-200 sm:text-base">
                        {auction.description}
                      </p>
                    )}

                    <Link
                      href={`/category?auctionId=${encodeURIComponent(
                        auction._id,
                      )}&status=upcoming_auction`}
                      className="mt-4 inline-flex items-center rounded-lg bg-[#FF5800] px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#E04D00]"
                    >
                      View Now
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
