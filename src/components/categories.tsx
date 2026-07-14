"use client";

import Image from "next/image";
import Link from "next/link";
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

  // Static Fallback Placeholder Logic configuration
  const placeholderImage = "/placeholder-category.png";

  if (isLoading) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {[...Array(7)].map((_, idx) => (
              <div key={idx} className="animate-pulse text-center">
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
        <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 lg:text-5xl">
              Browse Categories
            </h2>
            <p className="mt-3 text-lg text-gray-500 lg:text-xl">
              Find exactly what you&apos;re looking for by category.
            </p>
          </div>

          <Link
            href="/category"
            className="rounded bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
          >
            Explore All
          </Link>
        </div>

        {/* Categories Structural Grid Row Matrix */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {categories.map((item) => {
            // Evaluates exact schema checking path constraints parameters safely
            const dynamicDisplayImage = item.categoryImage?.url
              ? item.categoryImage.url
              : placeholderImage;

            return (
              <Link
                href={`/category?search=${encodeURIComponent(item.category)}`}
                key={item.category}
                className="group cursor-pointer text-center block"
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

                <h3 className="mt-5 text-2xl font-semibold text-gray-900 truncate px-2">
                  {item.category}
                </h3>

                <p className="mt-2 text-lg text-orange-500 font-medium">
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
