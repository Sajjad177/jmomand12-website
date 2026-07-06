"use client";

import { Calendar } from "lucide-react";

const auctionDays = ["Monday", "Tuesday", "Wednesday", "Thursday"];

export default function AuctionDays() {
  return (
    <section className="bg-white py-16">
      <div className="mx-40 px-6">
        {/* Heading */}
        <h2 className="mb-12 text-center text-4xl font-bold uppercase text-gray-900 lg:text-5xl">
          Auction Days
        </h2>

        {/* Days */}
        <div className="flex flex-wrap justify-center gap-6">
          {auctionDays.map((day) => (
            <button
              key={day}
              className="flex items-center gap-4 rounded-lg border border-black/20 bg-white px-4 py-4 transition-all duration-300 hover:border-orange-500 hover:bg-orange-50 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded bg-orange-500">
                <Calendar className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>

              {/* Day */}
              <span className="text-xl font-semibold uppercase text-[#0F172A]">
                {day}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
