"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card Container */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] border border-slate-700/50 px-6 py-14 sm:px-12 sm:py-16 md:px-16 md:py-20">
          {/* Subtle Corner Accent Line */}
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 via-indigo-400 to-transparent opacity-80" />

          {/* Inner Content Block */}
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            {/* Tagline */}
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">
              Start Saving Today
            </p>

            {/* Main Heading */}
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
              Ready To Start Winning <br className="hidden sm:inline" />
              Incredible Deals?
            </h2>

            {/* Subtext */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-indigo-100 sm:text-xl">
              Join over{" "}
              <span className="font-bold text-white">15,000 smart bidders</span>{" "}
              today and get instant access to premium liquidation inventory at
              up to{" "}
              <span className="font-bold text-orange-400">90% off retail</span>.
            </p>

            {/* Action Area */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/category"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-orange-500 px-8 py-4 text-sm font-bold text-white transition-colors duration-200 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#0F172A]"
              >
                Join Auctions Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
