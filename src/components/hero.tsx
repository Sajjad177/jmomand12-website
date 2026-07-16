"use client";

import Link from "next/link";
import AuctionDays from "./auctiondays";

export default function Hero() {
  return (
    <>
      {/* 1. HERO BANNER SECTION */}
      <section className="relative min-h-0 lg:min-h-[70vh] overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 py-6 sm:py-10 lg:py-14 flex items-center">
        {/* Subtle background ambient light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_60%)] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* RIGHT COLUMN FIRST on Mobile (Showcase Image Container) */}
            <div className="order-first lg:order-last lg:col-span-5 w-full flex flex-col items-center mt-0 lg:mt-0">
              <div className="relative w-full max-w-[280px] sm:max-w-[380px] lg:max-w-none h-[210px] sm:h-[300px] lg:h-[480px] xl:h-[520px]">
                {/* Main Composition Graphic */}
                <div
                  className="absolute inset-0 bg-contain bg-center bg-no-repeat z-10"
                  style={{
                    backgroundImage: "url('/Hero-Section-bg.png')",
                  }}
                />

                {/* Floating Card 1: Timer */}
                <div className="absolute left-[-5px] top-1 sm:left-[-15px] sm:top-6 z-20 rounded-xl sm:rounded-2xl border border-white/10 bg-blue-950/60 p-2 sm:p-4 backdrop-blur-md shadow-xl transition-transform hover:-translate-y-1">
                  <p className="mb-1 text-[6px] sm:text-[9px] font-bold uppercase tracking-wider text-blue-300">
                    Auction Closing
                  </p>
                  <div className="flex items-center gap-1 sm:gap-2.5 text-center text-white">
                    <div>
                      <h3 className="text-[10px] sm:text-xl font-black tracking-tight">
                        04
                      </h3>
                      <p className="text-[6px] sm:text-[8px] font-semibold text-gray-400 uppercase">
                        Hr
                      </p>
                    </div>
                    <span className="text-[10px] sm:text-lg font-bold text-orange-500 animate-pulse">
                      :
                    </span>
                    <div>
                      <h3 className="text-[10px] sm:text-xl font-black tracking-tight">
                        22
                      </h3>
                      <p className="text-[6px] sm:text-[8px] font-semibold text-gray-400 uppercase">
                        Min
                      </p>
                    </div>
                    <span className="text-[10px] sm:text-lg font-bold text-orange-500 animate-pulse">
                      :
                    </span>
                    <div>
                      <h3 className="text-[10px] sm:text-xl font-black tracking-tight">
                        15
                      </h3>
                      <p className="text-[6px] sm:text-[8px] font-semibold text-gray-400 uppercase">
                        Sec
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2: TV Bid Info */}
                <div className="absolute right-[-5px] top-14 sm:top-24 z-20 rounded-xl sm:rounded-2xl border border-white/10 bg-blue-950/60 p-2 sm:p-3 backdrop-blur-md shadow-xl transition-transform hover:-translate-y-1">
                  <p className="text-[7px] sm:text-[10px] font-medium text-gray-300">
                    John D. Wm
                  </p>
                  <h4 className="mt-0.5 text-[9px] sm:text-xs font-bold text-white">
                    Samsung 55&quot; TV
                  </h4>
                  <p className="mt-0.5 text-[10px] sm:text-sm font-extrabold text-orange-400">
                    $180
                  </p>
                </div>

                {/* Floating Card 3: Live Bid */}
                <div className="absolute bottom-1 sm:bottom-6 right-[-5px] sm:right-[-15px] z-20 rounded-xl sm:rounded-2xl border border-white/10 bg-blue-950/60 p-2 sm:p-4 backdrop-blur-md shadow-xl transition-transform hover:-translate-y-1">
                  <div className="flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" />
                    <p className="text-[7px] sm:text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                      Live Bid
                    </p>
                  </div>
                  <h3 className="mt-0.5 text-[9px] sm:text-base font-black text-white tracking-tight">
                    New Bid: $1,240
                  </h3>
                </div>
              </div>
            </div>

            {/* LEFT COLUMN LAST on Mobile (Text Content Container - Now Left-Aligned) */}
            <div className="order-last lg:order-first lg:col-span-7 flex flex-col justify-center text-left mt-2 lg:mt-0">
              <p className="mb-1.5 text-[9px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                Welcome to Discount Deals
              </p>

              <h1 className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.15] lg:leading-[1.1]">
                Bid Smarter.
                <br />
                <span className="text-orange-500 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Win Bigger.
                </span>
                <br />
                Save More.
              </h1>

              <p className="mt-3 sm:mt-4 mr-auto lg:mr-0 max-w-lg lg:max-w-xl text-[11px] sm:text-sm md:text-base leading-relaxed text-gray-300">
                Discover premium liquidation deals, overstock inventory,
                electronics, furniture, appliances, and exclusive auction
                opportunities from trusted sellers.
              </p>

              {/* Action Buttons: Left-aligned for mobile layout */}
              <div className="mt-5 sm:mt-6 flex flex-row flex-nowrap items-center justify-start gap-3 sm:gap-4 w-full">
                <Link
                  href="/category"
                  className="whitespace-nowrap px-5 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-xs sm:text-sm font-bold text-white transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.98]"
                >
                  Live Auctions
                </Link>

                <Link
                  href="/category"
                  className="whitespace-nowrap px-5 sm:px-6 py-2.5 rounded-full border-2 border-orange-500/80 text-xs sm:text-sm font-bold text-orange-400 bg-transparent transition-all duration-200 hover:bg-orange-500 hover:text-white active:scale-[0.98]"
                >
                  Buy Now
                </Link>
              </div>

              {/* DESKTOP-ONLY: Auction days show cleanly under buttons on wide screens */}
              <div className="hidden lg:block mt-8 border-t border-white/10 pt-6 w-full max-w-2xl">
                <AuctionDays isDarkTheme={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MOBILE-ONLY AUCTION DAYS SECTION */}
      <div className="block lg:hidden bg-gray-50 border-t border-gray-150 py-6 px-4">
        <div className="container mx-auto">
          <AuctionDays isDarkTheme={false} />
        </div>
      </div>
    </>
  );
}
