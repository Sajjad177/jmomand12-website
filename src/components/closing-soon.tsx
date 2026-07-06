"use client";

import Image from "next/image";
import Link from "next/link";

const auctionData = [
  {
    id: 1,
    title: "Auction Premium Plus - 11 Closing First",
    date: "Thu, Jun 18 at 6:00 PM ET",
    countdown: {
      d: "00",
      h: "09",
      m: "05",
      s: "05",
    },
    more: "+94 more lots available",
  },
  {
    id: 2,
    title: "Auction #169 Closing Next",
    date: "Thu, Jun 18 at 6:00 PM ET",
    countdown: {
      d: "09",
      h: "09",
      m: "05",
      s: "05",
    },
    more: "+94 more lots available",
  },
];

const products = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  image: "/product.jpg", // public/img/product.png
}));

export default function ClosingSoon() {
  return (
    <section className="bg-[#0D3B8E] py-20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Heading */}
        <h2 className="mb-10 text-4xl font-bold text-white lg:text-5xl">
          Closing Soon
        </h2>

        {/* Cards */}
        <div className="grid gap-8 lg:grid-cols-2">
          {auctionData.map((auction) => (
            <div key={auction.id} className="rounded-xl bg-white p-6 shadow-lg">
              {/* Header */}
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {auction.title}
                  </h3>

                  <p className="mt-3 text-gray-500">{auction.date}</p>
                </div>

                {/* Countdown */}
                <div className="flex items-start gap-2">
                  {[
                    { value: auction.countdown.d, label: "D" },
                    { value: auction.countdown.h, label: "H" },
                    { value: auction.countdown.m, label: "M" },
                    { value: auction.countdown.s, label: "S" },
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

              {/* High Value */}
              <div className="mt-8">
                <h4 className="mb-4 text-sm font-bold uppercase text-orange-500">
                  High Value
                </h4>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="overflow-hidden rounded-lg border border-[#0D3B8E]"
                    >
                      <Image
                        src={product.image}
                        alt="Product"
                        width={80}
                        height={80}
                        className="h-20 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Bids */}
              <div className="mt-8">
                <h4 className="mb-4 text-sm font-bold uppercase text-orange-500">
                  Most Bids
                </h4>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="overflow-hidden rounded-lg border border-[#0D3B8E]"
                    >
                      <Image
                        src={product.image}
                        alt="Product"
                        width={80}
                        height={80}
                        className="h-20 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center">
                <Link
                  href="/category"
                  className="font-medium text-orange-500 transition hover:text-orange-600"
                >
                  {auction.more}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
