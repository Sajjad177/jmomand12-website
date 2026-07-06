"use client";

import Image from "next/image";

const auctions = [
  {
    id: 1,
    image: "/img/upcoming/upcoming-1.png",
    date: "OCT 28 • 10:00 AM",
    title: "Mega Electronics Liquidation",
    description:
      "Over 500 lots of premium laptops, smartphones, and smart home devices.",
  },
  {
    id: 2,
    image: "/img/upcoming/upcoming-2.png",
    date: "OCT 30 • 09:30 AM",
    title: "Designer Furniture Showcase",
    description:
      "Exclusive sectional sofas, dining sets, and modern decor items.",
  },
];

export default function UpcomingAuctions() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <h2 className="mb-12 text-4xl font-bold text-gray-900 lg:text-5xl">
          Upcoming Auctions
        </h2>

        {/* Cards */}
        <div className="grid gap-8 lg:grid-cols-2">
          {auctions.map((item) => (
            <div
              key={item.id}
              className="relative h-[400px] overflow-hidden rounded-lg"
            >
              {/* Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition duration-500 hover:scale-105"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-8">
                {/* Date */}
                <div>
                  <span className="rounded-full bg-[#153E91] px-5 py-2 text-sm font-semibold uppercase text-white">
                    {item.date}
                  </span>
                </div>

                {/* Bottom */}
                <div>
                  <h3 className="mb-3 text-4xl font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mb-6 max-w-xl text-base text-slate-200">
                    {item.description}
                  </p>

                  <button className="rounded bg-orange-500 px-8 py-4 text-sm font-bold text-white transition hover:bg-orange-600">
                    Remind Me
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
