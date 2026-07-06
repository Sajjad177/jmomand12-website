"use client";

import Image from "next/image";

const closedAuctions = [
  {
    id: 1,
    image: "/closed.png",
    title: "Dell XPS 15 Laptop",
    bid: "$1,120.00",
    date: "Oct 24, 2024",
  },
  {
    id: 2,
    image: "/closed.png",
    title: "Casio G-Shock Premium Edition",
    bid: "$1,120.00",
    date: "Oct 24, 2024",
  },
  {
    id: 3,
    image: "/closed.png",
    title: "GE 1.1-cu ft 950-Watt Countertop Microwave",
    bid: "$1,120.00",
    date: "Oct 24, 2024",
  },
  {
    id: 4,
    image: "/closed.png",
    title: "CRAFTSMAN Black 3-Ton Steel Hydraulic Floor Jack",
    bid: "$1,120.00",
    date: "Oct 24, 2024",
  },
];

export default function ClosedAuctions() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <h2 className="mb-10 text-4xl font-bold text-gray-900 lg:text-5xl">
          Closed Auctions
        </h2>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {closedAuctions.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-lg">
              {/* Image */}
              <div className="relative h-96 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-300 hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="-rotate-12 rounded-lg bg-red-600 px-5 py-2">
                    <span className="text-base font-black text-white">
                      SOLD
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-5 rounded-b-lg border border-slate-200 bg-white p-5">
                <h3 className="line-clamp-1 text-2xl font-semibold text-gray-900">
                  {item.title}
                </h3>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-base text-gray-500">Winning Bid</p>

                    <h4 className="mt-2 text-lg font-bold text-gray-900">
                      {item.bid}
                    </h4>
                  </div>

                  <div className="text-right">
                    <p className="text-base text-gray-500">Closed Date</p>

                    <h4 className="mt-2 text-base font-semibold text-gray-500">
                      {item.date}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
