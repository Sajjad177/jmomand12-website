"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryImage {
  public_id: string;
  url: string;
}

interface CategoryItem {
  categoryImage: CategoryImage | null;
  category: string;
}

interface CategoriesApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: CategoryItem[];
}

export default function BrowseCategories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<CategoriesApiResponse>({
    queryKey: ["productCategories"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/categories`,
      );
      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to fetch categories schema.");
      }
      return result;
    },
  });

  const categories = response?.data || [];
  const placeholderImage = "/placeholder-category.png";

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.7; // Tighter scroll offset for accurate steps

      scrollContainerRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex gap-4 md:gap-6 overflow-hidden">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse text-center min-w-[140px] md:min-w-[150px]"
              >
                <div className="mx-auto h-32 w-32 md:h-36 md:w-36 rounded-full bg-slate-100" />
                <div className="mx-auto mt-4 h-4 w-20 rounded bg-slate-100" />
                <div className="mx-auto mt-2 h-3 w-14 rounded bg-slate-50" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bg-white py-16 text-center">
        <p className="text-sm font-medium text-slate-400">
          Unable to load categories at this time.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 md:py-16 select-none">
      <div className="container mx-auto px-4 md:px-8">
        {/* Simplified Typography Header Block */}
        <div className="mb-8 md:mb-10 text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Browse Categories
          </h2>
          <p className="mt-1 text-sm font-normal text-slate-500 md:text-base">
            Find exactly what you&apos;re looking for by category.
          </p>
        </div>
        r{/* Carousel Outer Dynamic Tracking Parent Container */}
        <div className="relative group/slider">
          {/* Edge Anchored Chevron Buttons (Visible on desktop hover) */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 hidden md:flex h-10 w-10 -translate-y-1/2 -translate-x-3 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-all duration-200 opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-2 hover:bg-slate-50 hover:text-slate-900 active:scale-90"
            aria-label="Slide left"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2]" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-10 hidden md:flex h-10 w-10 -translate-y-1/2 translate-x-3 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-all duration-200 opacity-0 group-hover/slider:opacity-100 group-hover/slider:-translate-x-2 hover:bg-slate-50 hover:text-slate-900 active:scale-90"
            aria-label="Slide right"
          >
            <ChevronRight className="h-5 w-5 stroke-[2]" />
          </button>

          {/* Slider Container with modern scaling configurations */}
          <div
            ref={scrollContainerRef}
            className="no-scrollbar flex gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((item) => {
              const dynamicDisplayImage = item.categoryImage?.url
                ? item.categoryImage.url
                : placeholderImage;

              return (
                <Link
                  href={`/category?category=${encodeURIComponent(item.category)}`}
                  key={item.category}
                  className="group cursor-pointer text-center block min-w-[130px] max-w-[130px] sm:min-w-[150px] sm:max-w-[150px] snap-start"
                >
                  {/* Clean Border-Free Rounded Graphic Node */}
                  <div className="mx-auto flex h-32 w-32 sm:h-36 sm:w-36 items-center justify-center overflow-hidden rounded-full bg-slate-50 border border-slate-100/80 ring-4 ring-transparent shadow-sm transition-all duration-300 group-hover:scale-[1.03] group-hover:ring-slate-50 group-hover:shadow-md relative">
                    <Image
                      src={dynamicDisplayImage}
                      alt={item.category}
                      width={144}
                      height={144}
                      className="h-full w-full object-cover"
                      priority
                    />
                  </div>

                  <h3 className="mt-3 sm:mt-4 text-sm sm:text-base font-semibold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors truncate px-1">
                    {item.category}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
