"use client";

import Link from "next/link";
import AuctionCard from "./auction-card";
const auctions = [
  {
    id: 1,
    image: "/img/auctions/auction-1.png",
    title: 'Samsung 55" Smart TV',
    category: "Electronics",
    bids: 42,
    currentBid: "$1,240",
    timeLeft: "02h 14m",
  },
  {
    id: 2,
    image: "/img/auctions/auction-2.png",
    title: "Luxury Office Chair",
    category: "Furniture",
    bids: 31,
    currentBid: "$420",
    timeLeft: "04h 08m",
  },
  {
    id: 3,
    image: "/img/auctions/auction-3.png",
    title: "Kitchen Appliance Set",
    category: "Kitchen",
    bids: 18,
    currentBid: "$560",
    timeLeft: "01h 53m",
  },
  {
    id: 4,
    image: "/img/auctions/auction-4.png",
    title: "Apple MacBook Pro",
    category: "Electronics",
    bids: 67,
    currentBid: "$2,150",
    timeLeft: "06h 11m",
  },
  {
    id: 5,
    image: "/img/auctions/auction-5.png",
    title: "Cordless Power Drill",
    category: "Tools",
    bids: 15,
    currentBid: "$180",
    timeLeft: "03h 32m",
  },
  {
    id: 6,
    image: "/img/auctions/auction-6.png",
    title: "Dining Table Set",
    category: "Furniture",
    bids: 24,
    currentBid: "$980",
    timeLeft: "05h 28m",
  },
  {
    id: 7,
    image: "/img/auctions/auction-7.png",
    title: "Gaming Console Bundle",
    category: "Gaming",
    bids: 54,
    currentBid: "$720",
    timeLeft: "02h 45m",
  },
  {
    id: 8,
    image: "/img/auctions/auction-8.png",
    title: "Coffee Machine",
    category: "Appliances",
    bids: 19,
    currentBid: "$350",
    timeLeft: "07h 20m",
  },
];

export default function ActiveAuctions() {
  return (
    <section className="bg-[#F8FAFC] py-20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
              Live Marketplace
            </p>

            <h2 className="text-4xl font-bold text-slate-900 lg:text-5xl">
              Active Auctions
            </h2>

            <p className="mt-4 text-lg text-slate-500">
              Discover trending liquidation auctions, electronics, furniture,
              appliances, tools and much more.
            </p>
          </div>

          <Link
            href="/auctions"
            className="inline-flex w-fit items-center rounded bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
          >
            View All Auctions
          </Link>
        </div>

        {/* Auction Grid */}
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {auctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              image={auction.image}
              title={auction.title}
              category={auction.category}
              bids={auction.bids}
              currentBid={auction.currentBid}
              timeLeft={auction.timeLeft}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
