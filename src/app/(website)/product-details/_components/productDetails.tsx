/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, ShoppingCart, ShieldCheck, ArrowLeft, Plus, Minus, Star, Award } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// --- Shadcn UI Skeleton helper ---
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200 dark:bg-slate-800 ${className}`}
      {...props}
    />
  );
}

// --- Dynamic Interfaces ---
interface ProductImage {
  public_id: string;
  url: string;
}

interface ProductDetails {
  _id: string;
  inventoryId: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  inventoryStatus: string;
  images: ProductImage[];
  totalReview: number;
  type: string;
  color: string[];
  quantity: number;
  price: number;
  manufacturer: string;
  averageReview: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductDetailsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: ProductDetails;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken;

  // Extracting product ID from params (supports id or productId directories)
  const productId = params?.id || params?.productId;

  // Selection states
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // --- Fetch Product Details ---
  const { data: response, isLoading, isError } = useQuery<ProductDetailsResponse>({
    queryKey: ["productDetails", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID not found.");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`
      );
      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to fetch product details.");
      }
      return result;
    },
    enabled: !!productId,
  });

  const product = response?.data;

  // Set default color once data loads successfully
  useState(() => {
    if (product?.color && product.color.length > 0) {
      setSelectedColor(product.color[0]);
    }
  });

  // --- Add To Cart Mutation ---
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Please log in to add items to your cart.");
      if (!product) throw new Error("No product data loaded.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          type: "cart",
          quantity: quantity,
        }),
      });

      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to add product to cart.");
      }
      return result;
    },
    onSuccess: () => {
      toast.success(`${product?.title} added to cart successfully!`);
      queryClient.invalidateQueries({ queryKey: ["userCartData"] }); // If you have cart header query
    },
    onError: (err: any) => {
      toast.error(err.message || "Add to cart failed.");
    },
  });

  // Quantity control helpers
  const handleIncrease = () => {
    if (product && quantity < product.quantity) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(`Only ${product?.quantity} items in stock.`);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <main className="bg-[#f8f9fb] min-h-screen py-10">
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          <Skeleton className="h-6 w-32" />
          <div className="rounded-xl bg-white border border-[#e5edf8] p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <Skeleton className="h-[450px] w-full rounded-md" />
              <div className="grid grid-cols-4 gap-2">
                <Skeleton className="h-20 rounded-md" />
                <Skeleton className="h-20 rounded-md" />
                <Skeleton className="h-20 rounded-md" />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-10 w-1/4" />
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="bg-[#f8f9fb] min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">Could not track down details parameters or API is down.</p>
        <button onClick={() => router.back()} className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#003da5] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </main>
    );
  }

  const productImages = product.images || [];
  const activeMainImage = productImages[activeImgIndex]?.url || "/images/placeholder.png";
  const dummyOldPrice = product.price * 1.3; // UI Dummy markdown representation 

  return (
    <main className="bg-[#f8f9fb] min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        
        {/* Back Link */}
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </button>
        </div>

        {/* --- MAIN PRODUCT BLOCK (Reference to visual layout) --- */}
        <div className="rounded-xl bg-white border border-[#e5edf8] p-6 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Gallery Section */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative h-[480px] w-full overflow-hidden rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                <Image
                  src={activeMainImage}
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                  priority
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {/* <span className="rounded-[4px] bg-[#ff6b1a] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                    30% OFF
                  </span> */}
                  <span className={`rounded-[4px] px-2 py-0.5 text-[10px] font-bold text-white uppercase ${
                    product.inventoryStatus === "available" ? "bg-emerald-500" : "bg-red-500"
                  }`}>
                    {product.inventoryStatus === "available" ? "IN STOCK" : "OUT OF STOCK"}
                  </span>
                </div>
              </div>

              {/* Thumbnails row */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {productImages.map((img, index) => (
                    <button
                      key={img.public_id}
                      onClick={() => setActiveImgIndex(index)}
                      className={`relative h-16 w-full overflow-hidden rounded-lg border bg-white p-1 transition-all ${
                        index === activeImgIndex
                          ? "border-2 border-[#003da5]"
                          : "border-[#e5edf8] hover:border-slate-300"
                      }`}
                    >
                      <Image src={img.url} alt="thumbnail" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info details Section */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#003da5]">
                  {product.category}
                </span>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-[#111827] mt-1 leading-tight">
                  {product.title}
                </h1>

                {/* Rating & Brand Meta block */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <span className="text-orange-400 font-bold flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {product.averageReview || "4.9"}
                    </span>
                    <span>({product.totalReview || "0"} Reviews)</span>
                  </div>
                  <span>|</span>
                  <div>
                    by <span className="font-bold text-[#003da5]">{product.manufacturer}</span>
                  </div>
                  <span>|</span>
                  <div className="rounded-[4px] bg-[#eef4ff] text-[#003da5] font-bold px-2 py-0.5 capitalize">
                    {product.condition.replace("_", " ")}
                  </div>
                </div>

                <div className="h-[1px] bg-slate-100 my-5" />

                {/* Pricing Block */}
                <div className="bg-[#fcfbf9] rounded-xl border border-orange-100/70 p-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Flash Price</div>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-4xl font-extrabold text-[#111827]">${product?.price?.toFixed(2)}</span>
                      <span className="text-sm font-bold text-slate-400 line-through">${dummyOldPrice?.toFixed(0)}.00</span>
                    </div>
                  </div>
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 text-xs font-bold rounded-full">
                    Save ${(dummyOldPrice - product?.price).toFixed(0)}
                  </span>
                </div>

                {/* Description */}
                <div className="mt-5 space-y-2">
                  <h3 className="text-sm font-bold text-[#111827]">Overview</h3>
                  <p className="text-sm leading-6 text-slate-500">{product.description}</p>
                </div>

                {/* Color Selector */}
                {product.color && product.color.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Color</h3>
                    <div className="flex items-center gap-2">
                      {product.color.map((col) => (
                        <button
                          key={col}
                          onClick={() => setSelectedColor(col)}
                          className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase transition-all ${
                            selectedColor === col
                              ? "bg-[#003da5] text-white border-[#003da5]"
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action row (Counter, Add to Cart & Buy) */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Quantity Controller */}
                  <div className="flex items-center justify-between border border-[#e5edf8] rounded-lg h-12 w-full sm:w-32 px-3 bg-slate-50/50">
                    <button
                      onClick={handleDecrease}
                      className="text-slate-400 hover:text-slate-800 transition-colors p-1"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-sm text-[#111827]">{quantity}</span>
                    <button
                      onClick={handleIncrease}
                      className="text-slate-400 hover:text-slate-800 transition-colors p-1"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => addToCartMutation.mutate()}
                    disabled={addToCartMutation.isPending || product.inventoryStatus !== "available"}
                    className="flex-1 w-full h-12 rounded-lg bg-[#003da5] hover:bg-[#002b75] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                  </button>

                  {/* Quick Buy Button */}
                  {/* <button
                    onClick={() => toast.success("Redirecting to checkout session...")}
                    disabled={product.inventoryStatus !== "available"}
                    className="flex-1 w-full h-12 rounded-lg bg-[#ff6b1a] hover:bg-[#e55a00] text-white font-bold text-sm transition-all disabled:opacity-50"
                  >
                    Buy Now
                  </button> */}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center sm:justify-start">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Warranty verification parameters &amp; authentic brand seal protected.</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* --- DETAIL DESCRIPTION BLOCK --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#e5edf8] p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Product Description</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              This authentic {product.title} manufactured by {product.manufacturer} is designed to meet top industry standards. Fully verified by the quality control segment, this item has passed safety tests, fabric endurance checks (where applicable), and detailed inspection benchmarks. Suitable for various conditions with durable structural finishes.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white rounded-xl border border-[#e5edf8] p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Key Benefits</h2>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Authentic item supplied by {product.manufacturer}.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Certified Quality Check passed successfully.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Secure payments, fast checkout, and easy returns.
              </li>
            </ul>
          </div>
        </div>

        {/* --- SPECIFICATIONS TABLE --- */}
        <div className="bg-white rounded-xl border border-[#e5edf8] overflow-hidden">
          <div className="bg-[#f8fbff] px-6 py-4 border-b border-[#e5edf8]">
            <h2 className="font-bold text-slate-800 text-sm">Product Specifications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 text-xs">
            <div className="border-r border-[#e5edf8]">
              <div className="grid grid-cols-2 border-b border-[#e5edf8] p-4">
                <span className="text-slate-400 font-medium">Brand</span>
                <span className="text-slate-800 font-semibold">{product.manufacturer}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-[#e5edf8] md:border-b-0 p-4">
                <span className="text-slate-400 font-medium">Retail Code</span>
                <span className="text-slate-800 font-mono">{product.inventoryId}</span>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 border-b border-[#e5edf8] p-4">
                <span className="text-slate-400 font-medium">Condition</span>
                <span className="text-slate-800 font-semibold capitalize">{product.condition.replace("_", " ")}</span>
              </div>
              <div className="grid grid-cols-2 p-4">
                <span className="text-slate-400 font-medium">In-Stock Unit Count</span>
                <span className="text-slate-800 font-bold text-orange-500">{product.quantity} items left</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}