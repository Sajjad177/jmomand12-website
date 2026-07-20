/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { CategorySkeleton } from "./loading";
import { useCategories } from "../hooks/useCategory";

export default function BrowseCategories() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useCategories();
  const categories = data?.data;

  const placeholderImage = "/placeholder-category.png";

  // Slider Navigation Logic
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      // Scroll by 80% of the visible container width for a smooth transition
      const scrollAmount = clientWidth * 0.8;

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
    return <CategorySkeleton />;
  }

  if (isError) {
    return (
      <section className="bg-gray-50/50 py-12 text-center text-sm font-semibold text-red-500">
        <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-4">
          Error loading categories. Please try refreshing the page.
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-10 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Content Block Panel */}
        <div className="mb-6 md:mb-12 text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl">
            Shop by Category
          </h2>
          <p className="mt-1.5 text-sm text-gray-500 sm:text-base md:text-lg">
            Find exactly what you&apos;re looking for.
          </p>
        </div>

        {/* Outer Matrix Wrapper to containing dynamic floating arrows */}
        <div className="relative group/slider">
          {/* Left Side Floating Arrow (Hidden on Mobile, visible on desktop hover) */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 hidden sm:flex h-11 w-11 -translate-y-1/2 -translate-x-4 items-center justify-center rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm text-gray-600 shadow-md opacity-0 transition-all duration-300 group-hover/slider:opacity-100 group-hover/slider:translate-x-2 hover:bg-white hover:text-gray-900 active:scale-95"
            aria-label="Slide left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Right Side Floating Arrow (Hidden on Mobile, visible on desktop hover) */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-10 hidden sm:flex h-11 w-11 -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm text-gray-600 shadow-md opacity-0 transition-all duration-300 group-hover/slider:opacity-100 group-hover/slider:-translate-x-2 hover:bg-white hover:text-gray-900 active:scale-95"
            aria-label="Slide right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          {/* Categories Horizontal Slider Matrix Container */}
          <div
            ref={scrollContainerRef}
            className="no-scrollbar flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories?.map((item: any) => {
              const dynamicDisplayImage = item.categoryImage?.url
                ? item.categoryImage.url
                : placeholderImage;

              return (
                <Link
                  href={`/category?category=${encodeURIComponent(item.category)}`}
                  key={item.category}
                  className="group cursor-pointer text-center block min-w-[84px] max-w-[84px] sm:min-w-[140px] sm:max-w-[140px] md:min-w-[160px] md:max-w-[160px] snap-start"
                >
                  {/* Clean Fluid Rounded Frame */}
                  <div className="mx-auto flex h-[84px] w-[84px] sm:h-[140px] sm:w-[140px] md:h-[160px] md:w-[160px] items-center justify-center overflow-hidden rounded-full bg-gray-50 shadow-sm transition-all duration-300 group-hover:shadow-md relative">
                    <Image
                      src={dynamicDisplayImage}
                      alt={item.category}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
                      priority
                    />

                    {/* Subtle micro-interaction overlay */}
                    <div className="absolute inset-0 bg-black/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Refined Mobile-First Typography */}
                  <h3 className="mt-2.5 sm:mt-4 text-xs sm:text-sm md:text-base font-medium tracking-tight text-gray-700 transition-colors duration-200 group-hover:text-gray-900 truncate px-0.5">
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
