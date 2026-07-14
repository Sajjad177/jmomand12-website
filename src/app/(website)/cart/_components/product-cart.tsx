/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Minus, Shield, RefreshCw, Truck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { createCartCheckoutSession } from "@/features/orders/api/orders.api";

// --- Shadcn UI Skeleton loader component helper ---
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/80 ${className}`} {...props} />
  );
}

// --- Domain Model Interfaces Matching API Payload ---
interface ProductImage {
  public_id: string;
  url: string;
}

interface CartProduct {
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

interface CartItem {
  _id: string;
  userId: string;
  productId: CartProduct;
  type: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface CartApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: CartItem[];
}

export default function UserCartPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
    ) {
      return (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback;
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  };

  // --- 1. Fetch Cart Items Query ---
  const { data: response, isLoading, isError } = useQuery<CartApiResponse>({
    queryKey: ["userCartData"],
    queryFn: async () => {
      if (!token) throw new Error("Authentication token not identified.");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to retrieve cart items.");
      }
      return result;
    },
    enabled: !!token,
  });

  const cartItems = response?.data || [];

  // --- 2. Update Quantity Mutation ---
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: "increase" | "decrease" }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/quantity/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Quantity modulation process failed.");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCartData"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error updating quantity.");
    },
  });

  // --- 3. Delete Cart Item Mutation ---
  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Item removal failed.");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Product dropped from your shopping cart.");
      queryClient.invalidateQueries({ queryKey: ["userCartData"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error deleting item.");
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: createCartCheckoutSession,
    onSuccess: (result) => {
      if (!result.checkoutUrl) {
        toast.error("The checkout session was created, but no checkout URL was returned.");
        return;
      }

      toast.success("Redirecting to secure checkout...");
      window.location.assign(result.checkoutUrl);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "We couldn't start checkout right now."));
    },
  });

  // --- Order Breakdown Math Calculations ---
const netGrandTotal = cartItems.reduce(
  (total, item) =>
    total + (item.productId?.price || 0) * item.quantity,
  0
);

  if (isLoading) {
    return (
      <main className="bg-[#f7f9fc] min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            {Array.from({ length: 2 }).map((_, idx) => (
              <Skeleton key={idx} className="h-44 w-full rounded-lg" />
            ))}
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="bg-[#f7f9fc] min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-lg font-bold text-slate-800">Authorization / Fetch Error</h2>
        <p className="text-sm text-slate-500 mt-1">Please ensure you are authenticated or that your session token hasn&apos;t expired.</p>
        <Link
          href="/login?callbackUrl=%2Fcart"
          className="mt-4 inline-flex rounded bg-[#003da5] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#002b75]"
        >
          Sign in again
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[#f7f9fc] min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT CONTAINER: CART BULK ITEMS VIEW LOOP */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.length === 0 ? (
              <div className="rounded-xl border border-[#dce6f5] bg-white p-12 text-center">
                <p className="text-slate-400 font-medium text-sm">Your active shopping cart is empty.</p>
                <Link href="/products" className="mt-4 inline-flex px-6 py-2.5 bg-[#003da5] text-white text-xs font-bold rounded hover:bg-[#002b75] transition-all">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              cartItems.map((item) => {
                const productInfo = item.productId;
                if (!productInfo) return null;

                const mainImage = productInfo.images?.[0]?.url || "/images/placeholder.png";
                const estimatedOriginalPrice = productInfo.price * 1.3;

                return (
                  <div
                    key={item._id}
                    className="rounded-xl border border-[#dce6f5] bg-white p-5 shadow-sm transition-all flex flex-col sm:flex-row gap-5 relative"
                  >
                    {/* Media Thumbnail Grid box */}
                    <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-lg border border-slate-100 shrink-0 bg-white p-1 flex items-center justify-center overflow-hidden">
                      <Image
                        src={mainImage}
                        alt={productInfo.title}
                        fill
                        className="object-contain p-2"
                      />
                      {/* <span className="absolute top-2 left-2 rounded bg-orange-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                        30% OFF
                      </span> */}
                    </div>

                    {/* Meta core element layer column setup */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Upper row: breadcrumb and title */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span className="text-[#003da5]">{productInfo.category}</span>
                          <span>by {productInfo.manufacturer}</span>
                        </div>
                        
                        <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug pr-4">
                          {productInfo.title}
                        </h2>

                        <div className="mt-1 flex items-center gap-2 text-[11px] font-semibold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-50 text-emerald-600 shrink-0" />
                          <span className="capitalize">{productInfo.condition.replace("_", " ")} – Verified Stock</span>
                        </div>
                      </div>

                      {/* Controls parameters row: Price counter, operations block mapping */}
                      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-slate-50 pt-3">
                        
                        {/* Price & Quantity layout segment */}
                        <div className="flex items-center gap-6">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-tight">Unit Price</div>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-lg font-extrabold text-slate-900">${productInfo.price.toFixed(2)}</span>
                              <span className="text-[11px] font-medium text-slate-400 line-through">${estimatedOriginalPrice.toFixed(0)}.00</span>
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-tight pl-1">Quantity</div>
                            <div className="mt-1 flex items-center justify-between border border-[#dce6f5] rounded h-8 w-24 px-2 bg-slate-50/50">
                              <button
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateQuantityMutation.mutate({ id: item._id, action: "decrease" });
                                  } else {
                                    deleteItemMutation.mutate(item._id);
                                  }
                                }}
                                disabled={updateQuantityMutation.isPending}
                                className="text-slate-400 hover:text-slate-800 transition-colors p-0.5 disabled:opacity-50"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-extrabold text-xs text-slate-900">{item.quantity}</span>
                              <button
                                onClick={() => {
                                  if (item.quantity < productInfo.quantity) {
                                    updateQuantityMutation.mutate({ id: item._id, action: "increase" });
                                  } else {
                                    toast.error("Maximum available product inventory cap reached.");
                                  }
                                }}
                                disabled={updateQuantityMutation.isPending}
                                className="text-slate-400 hover:text-slate-800 transition-colors p-0.5 disabled:opacity-50"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Functional control bar triggers */}
                        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                          {/* <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
                            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#003da5] focus:ring-0 w-3.5 h-3.5" />
                            Mark for Purchase
                          </label> */}

                          <button
                            onClick={() => deleteItemMutation.mutate(item._id)}
                            disabled={deleteItemMutation.isPending}
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>

                          {/* <button className="flex items-center gap-1 hover:text-slate-700 transition-colors hidden sm:inline-flex">
                            <Share2 className="w-3.5 h-3.5" />
                            Share
                          </button> */}
                        </div>

                      </div>
                    </div>

                    {/* Stock status indicator badge matching reference placement logic */}
                    <div className="absolute top-5 right-5 text-right hidden md:block">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
                        In Stock
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">Estimated 2-3 Days Deliver</div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT CONTAINER: ORDER BREAKDOWN SUMMARY SIDEBAR MATCH */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="rounded-xl border border-[#dce6f5] bg-white overflow-hidden shadow-sm">
              <div className="bg-[#f8fbff] border-b border-[#dce6f5] px-5 py-4">
                <h3 className="text-sm font-bold text-slate-900">Order Summary</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{cartItems.length} items grouped in your lot</p>
              </div>

              <div className="p-5 space-y-3.5 text-xs text-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Items Total</span>
                  <span className="font-bold text-slate-800">${netGrandTotal}</span>
                </div>
                
                {/* <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Discount (Promo 15%)</span>
                  <span className="font-bold text-emerald-600">-${discountSum.toFixed(2)}</span>
                </div> */}

                {/* <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Estimated Shipping</span>
                  <span className="font-bold text-emerald-600">{shippingCharge === 0 ? "FREE" : `$${shippingCharge.toFixed(2)}`}</span>
                </div> */}

                {/* <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Sales Tax (8.75%)</span>
                  <span className="font-bold text-slate-800">${computedSalesTax.toFixed(2)}</span>
                </div> */}

                {/* <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    Service Fee
                    <Info className="w-3 h-3 text-slate-300 cursor-pointer" />
                  </span>
                  <span className="font-bold text-slate-800">${processingServiceFee.toFixed(2)}</span>
                </div> */}

                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-sm font-bold text-slate-900">Grand Total</span>
                  <span className="text-2xl font-black text-slate-900">${netGrandTotal.toFixed(2)}</span>
                </div>

                {/* Main Process Button handlers */}
                <div className="pt-4 space-y-2.5">
                  <button
                    onClick={() => {
                      if (status !== "authenticated") {
                        router.push("/login?callbackUrl=%2Fcart");
                        return;
                      }

                      checkoutMutation.mutate();
                    }}
                    disabled={cartItems.length === 0 || checkoutMutation.isPending || status === "loading"}
                    className="w-full h-11 bg-[#ff6b1a] hover:bg-[#e55a00] text-white font-bold text-sm rounded transition-all shadow-sm disabled:opacity-50"
                  >
                    {checkoutMutation.isPending ? "Redirecting to Checkout..." : "Proceed to Checkout"}
                  </button>
                  
                  <Link
                    href="/products"
                    className="w-full h-11 border border-[#dce6f5] hover:bg-slate-50 text-slate-700 font-bold text-sm rounded transition-all flex items-center justify-center bg-white"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Why buy with us features panel stack */}
            <div className="rounded-xl border border-[#dce6f5] bg-white p-5 shadow-sm space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Why Buy With Us?</h4>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-[#eef4ff] rounded text-[#003da5] shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Secure Checkout</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">256-bit SSL encryption safeguards transactions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-[#eef4ff] rounded text-[#003da5] shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Easy Returns Policy</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">30-day hassle-free return window verification.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-[#eef4ff] rounded text-[#003da5] shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Insured Delivery Network</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Trackable standard multi-tier courier operations.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
