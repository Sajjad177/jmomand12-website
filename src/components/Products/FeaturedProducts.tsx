"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { InventoryProductsResponse } from "../../types/product";

// Inline Skeleton matching new card aspect ratio
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
      {...props}
    />
  );
}

export default function FeaturedProducts() {
  const {
    data: responseData,
    isLoading,
    isError,
  } = useQuery<InventoryProductsResponse>({
    queryKey: ["featuredProductsData", "for_sale"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/inventory?productType=for_sale`,
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to fetch featured products data",
        );
      }

      return result;
    },
  });

  const productsList = responseData?.data || [];

  return (
    <section className="bg-slate-50/50 py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-500">
              Direct Purchase
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Featured Products
            </h2>
          </div>

          <Link
            href="/category"
            className="inline-flex w-fit items-center rounded-lg border border-orange-500 px-6 py-2.5 text-sm font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
          >
            View All
          </Link>
        </div>

        {/* Loading / Error / Data States */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 space-y-3"
              >
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-8 w-1/3 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-red-500 font-medium">
            Failed to load featured products. Please reload the page.
          </div>
        ) : productsList.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-medium">
            No featured items on sale right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {productsList.map((product) => {
              const displayImage =
                product.images?.[0]?.url || "/img/products/placeholder.png";
              const displayPrice = product.price
                ? `$${product.price.toFixed(2)}`
                : "$0.00";

              return (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  image={displayImage}
                  title={product.title}
                  category={product.category}
                  bids={0}
                  price={displayPrice}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
