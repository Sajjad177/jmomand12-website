"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";

// --- Shadcn UI Skeleton Component Inline Implementation ---
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80 ${className}`}
      {...props}
    />
  );
}

// --- API Interfaces Definition matching your response structural mapping ---
interface ProductImage {
  public_id: string;
  url: string;
}

interface InventoryProduct {
  _id: string;
  inventoryId: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  inventoryStatus: string;
  images: ProductImage[];
  type: string;
  color: string[];
  quantity: number;
  price: number;
  manufacturer: string;
}

interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface InventoryProductsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: InventoryProduct[];
  meta: MetaData;
}

export default function FeaturedProducts() {
  // Fetching products from API filtered by type=for_sale using TanStack useQuery
  const { data: responseData, isLoading, isError } = useQuery<InventoryProductsResponse>({
    queryKey: ["featuredProductsData", "for_sale"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/inventory?type=for_sale`
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to fetch featured products data");
      }

      return result;
    },
  });

  const productsList = responseData?.data || [];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-4xl font-bold text-gray-900 lg:text-5xl">
            Featured Products
          </h2>

          <Link
            href="/category"
            className="inline-flex w-fit items-center rounded border border-orange-500 px-8 py-4 font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
          >
            View All
          </Link>
        </div>

        {/* Dynamic Skeleton Loader and Error Grid States */}
        {isLoading ? (
          /* --- Shadcn UI Skeleton Layout matching grid cols template --- */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col overflow-hidden rounded-lg border border-slate-100 p-4 space-y-4 shadow-sm"
              >
                {/* Product Image Box Skeleton */}
                <Skeleton className="h-56 w-full rounded-md" />
                
                {/* Meta details text skeleton wrapper */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-5 w-5/6" />
                </div>
                
                {/* Price and bottom bar data element skeleton */}
                <div className="pt-2 flex items-center justify-between">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500 font-medium">
            Failed to pull inventory products list. Please reload again.
          </div>
        ) : productsList.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium">
            No featured items on sale right now.
          </div>
        ) : (
          /* --- Products Grid Layer parsed from API data layer --- */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {productsList.map((product) => {
              const displayImage = product.images?.[0]?.url || "/img/products/placeholder.png";
              const displayPrice = product.price ? `$${product.price.toFixed(2)}` : "$0.00";

              return (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  image={displayImage}
                  title={product.title}
                  category={product.category}
                  bids={0} // Default static value context if required by core layout design properties
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