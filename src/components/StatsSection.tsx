"use client";

import React from "react";

interface StatItem {
  number: string;
  label: string;
}

const stats: StatItem[] = [
  {
    number: "2,500+",
    label: "ACTIVE AUCTIONS",
  },
  {
    number: "15,000+",
    label: "REGISTERED BIDDERS",
  },
  {
    number: "8,000+",
    label: "PRODUCTS SOLD",
  },
  {
    number: "$2.5M+",
    label: "TOTAL SAVINGS",
  },
];

export default function StatsSection() {
  return (
    <section className="bg-[#EEF4FF] py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Horizontal Swipe Container & Desktop 4-Column Grid */}
        <div className="flex snap-x snap-mandatory overflow-x-auto pb-4 scrollbar-none md:grid md:grid-cols-4 md:gap-8 md:overflow-visible md:pb-0">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex shrink-0 w-[70vw] snap-center flex-col items-center justify-center text-center sm:w-[45vw] md:w-auto"
            >
              {/* Stat Number */}
              <h2 className="text-4xl font-extrabold tracking-tight text-orange-500 sm:text-5xl lg:text-6xl">
                {stat.number}
              </h2>

              {/* Stat Label */}
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-600 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
