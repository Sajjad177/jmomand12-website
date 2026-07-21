"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ProductCardProps = {
  id: string;
  image: string;
  title: string;
  category: string;
  bids?: number;
  price: string;
  originalPrice?: string;
};

export default function ProductCard({
  id,
  image,
  title,
  category,
  bids = 0,
  price,
  originalPrice,
}: ProductCardProps) {
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/product-details/${id}`);
  };

  return (
    <Link
      href={`/product-details/${id}`}
      className="group flex flex-col h-full overflow-hidden rounded-xl border border-slate-200/80 bg-white transition-all hover:border-slate-300"
    >
      {/* Balanced 4:3 Aspect Ratio Image Frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden p-3 flex items-center justify-center">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-2 transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>

      {/* Content Area with Flex-Grow for Uniform Height */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        {/* Title and Category */}
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-bold tracking-tight text-slate-800 transition-colors group-hover:text-orange-500 leading-snug">
            {title}
          </h3>

          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {category} {bids > 0 ? `• ${bids} BIDS` : ""}
          </p>
        </div>

        {/* Pricing and Action Button */}
        <div className="flex items-end justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold text-slate-900 leading-none">
              {price}
            </span>
            {originalPrice && (
              <span className="mt-1 text-[11px] font-medium text-slate-400 line-through leading-none">
                {originalPrice}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-sm border border-orange-500 px-3 py-2 text-xs font-semibold text-orange-500 cursor-pointer transition-colors duration-200 hover:bg-orange-500 hover:text-white shrink-0"
          >
            View More
          </button>
        </div>
      </div>
    </Link>
  );
}
