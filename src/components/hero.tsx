"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-blue-800">
      {/* Removed empty overlay — add one with actual content if needed, e.g. a gradient */}

      <div className="container relative mx-auto flex items-center justify-between px-6 py-32 lg:px-8">
        {/* Left Content */}
        <div className="max-w-3xl">
          <p className="mb-4 text-lg uppercase tracking-[0.3em] text-gray-200">
            Welcome to Discount Deals
          </p>

          <h1 className="text-5xl font-bold leading-none text-white md:text-7xl xl:text-8xl">
            Bid Smarter.
            <br />
            <span className="text-orange-500">Win Bigger.</span>
            <br />
            Save More.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-200">
            Discover premium liquidation deals, overstock inventory,
            electronics, furniture, appliances, and exclusive auction
            opportunities from trusted sellers.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">
            <Link
              href="#"
              className="rounded bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-orange-600"
            >
              Live Auctions
            </Link>

            <Link
              href="#"
              className="rounded border border-orange-500 px-8 py-4 text-lg font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
            >
              Buy Now
            </Link>
          </div>
        </div>

        {/* Floating Cards — now has explicit dimensions so background + absolute children render */}
        <div
          className="relative hidden h-[700px] w-[1000px] bg-contain bg-center bg-no-repeat xl:block"
          style={{
            backgroundImage: "url('/Hero-Section-bg.png')",
          }}
        >
          {/* Timer — repositioned to top-left of the container */}
          <div className="absolute left-0 top-20 rounded-xl border border-white/20 bg-white/20 p-6 backdrop-blur-md">
            <p className="mb-4 text-sm font-bold uppercase text-white">
              Auction Closing
            </p>

            <div className="flex items-center gap-4 text-center text-white">
              <div>
                <h3 className="text-3xl font-bold">04</h3>
                <p className="text-sm text-gray-300">HR</p>
              </div>

              <span className="text-2xl">:</span>

              <div>
                <h3 className="text-3xl font-bold">22</h3>
                <p className="text-sm text-gray-300">MIN</p>
              </div>

              <span className="text-2xl">:</span>

              <div>
                <h3 className="text-3xl font-bold">15</h3>
                <p className="text-sm text-gray-300">SEC</p>
              </div>
            </div>
          </div>

          {/* Product Card — top-right */}
          <div className="absolute right-8 top-40 rounded-xl border border-white/20 bg-white/30 p-5 backdrop-blur-md">
            <p className="text-sm font-semibold text-white">John D. Wm</p>

            <h4 className="mt-2 text-lg font-bold text-white">
              Samsung 55&quot; TV
            </h4>

            <p className="mt-2 font-bold text-orange-400">$180</p>
          </div>

          {/* Live Bid — bottom-right */}
          <div className="absolute bottom-16 right-8 rounded-xl border border-white/20 bg-white/30 p-6 backdrop-blur-md">
            <p className="text-sm font-semibold uppercase text-white">
              Live Bid
            </p>

            <h3 className="mt-2 text-xl font-bold text-white">
              New Bid: $1,240
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
