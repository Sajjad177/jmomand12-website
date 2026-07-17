"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";

// --- API Schema Configuration Contracts ---
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

  // --- TanStack Query Integration pipeline mapping ---
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

  // Slider Navigation Logic
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      // Scroll by 80% of the visible container width for a smooth transition
      const scrollAmount = clientWidth * 0.8; 
      
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex gap-8 overflow-hidden">
            {[...Array(7)].map((_, idx) => (
              <div key={idx} className="animate-pulse text-center min-w-[160px]">
                <div className="mx-auto h-40 w-40 rounded-full bg-gray-200" />
                <div className="mx-auto mt-5 h-6 w-24 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bg-white py-16 text-center text-sm font-semibold text-red-500">
        Error loading dynamic categories properties index layer.
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header Content Block Panel */}
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 lg:text-5xl">
              Browse Categories
            </h2>
            <p className="mt-3 text-lg text-gray-500 lg:text-xl">
              Find exactly what you&apos;re looking for by category.
            </p>
          </div>

          {/* Top Corner Navigation Arrow System */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95"
              aria-label="Slide left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 active:scale-95"
              aria-label="Slide right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Categories Horizontal Slider Matrix Container */}
        <div 
          ref={scrollContainerRef}
          className="no-scrollbar flex gap-8 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((item) => {
            const dynamicDisplayImage = item.categoryImage?.url
              ? item.categoryImage.url
              : placeholderImage;

            return (
              <Link
                href={`/category?category=${encodeURIComponent(item.category)}`}
                key={item.category}
                className="group cursor-pointer text-center block min-w-[160px] max-w-[160px] snap-start"
              >
                <div className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-[6px] border-[#153B7A] transition duration-300 group-hover:scale-105 bg-slate-50 relative">
                  <Image
                    src={dynamicDisplayImage}
                    alt={item.category}
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-gray-900 truncate px-2">
                  {item.category}
                </h3>

                <p className="mt-2 text-base text-orange-500 font-medium">
                  Active Items
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}