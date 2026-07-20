"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ProductCardProps = {
  image: string;
  title: string;
  category: string;
  bids: number;
  price: string;
  id: string;
};

export default function ProductCard({
  image,
  title,
  category,
  id,
  price,
}: ProductCardProps) {
  const router = useRouter();
  return (
    <Link href={`/product-details/${id}`} className="group">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {/* Product Image */}
        <div className="relative h-72 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition duration-300 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          {/* Title & Category */}
          <div className="space-y-2">
            <h3 className="line-clamp-1 text-2xl font-semibold text-gray-900">
              {title}
            </h3>

            <p className="text-base font-bold uppercase text-gray-500">
              {category}
            </p>
          </div>

          {/* Price & Button */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-black">{price}</h4>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                router.push(`/product-details/${id}`);
              }}
              className="flex-1 rounded-sm border border-orange-500 px-6 py-4 text-sm font-bold text-orange-500 transition hover:bg-orange-500 hover:text-white"
            >
              View Product
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
