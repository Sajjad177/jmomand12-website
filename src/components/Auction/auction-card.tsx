"use client";

import Image from "next/image";
import Link from "next/link";

interface AuctionCardProps {
  image: string;
  title: string;
  category: string;
  bids: number;
  currentBid: string;
  timeLeft: string;
  id:string
}

export default function AuctionCard({
  image,
  title,
  category,
  bids,
  id,
  currentBid,
  timeLeft,
}: AuctionCardProps) {

  
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={400}
          height={320}
          className="h-72 w-full object-cover"
        />

        {/* Live Badge */}
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded bg-green-500 px-2 py-1">
          <span className="h-2 w-2 rounded-full bg-white"></span>

          <span className="text-[10px] font-bold tracking-wider text-white">
            LIVE
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5 p-5">
        <div>
          <h3 className="line-clamp-1 text-2xl font-semibold text-gray-900">
            {title}
          </h3>

          <p className="mt-2 text-sm font-bold uppercase text-gray-500">
            {category} • {bids} Bids
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-gray-500">Current Bid</p>

            <h4 className="mt-1 text-2xl font-black text-gray-900">
              {currentBid}
            </h4>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-gray-500">Time Left</p>

            <h4 className="mt-1 text-base font-black text-orange-500">
              {timeLeft}
            </h4>
          </div>
        </div>

        <Link href={`/auctions-details/${id}`}>
        <button  className="w-full rounded border border-orange-500 py-4 font-bold text-orange-500 transition hover:bg-orange-500 hover:text-white">
         View Details
        </button>
        </Link>
      </div>
    </div>
  );
}
