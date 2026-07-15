/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, ChevronUp, Star, Filter, Loader2, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// --- Static Meta Configuration matching backend schema limits ---

// Categories will be fetched dynamically
// const categories = [ ... ]; // REMOVED static categories

const retailValues = [
  { id: "under-100", label: "Under $100", apiValue: "under-100" },
  { id: "100-500", label: "$100 - $500", apiValue: "100-500" },
  { id: "500-1000", label: "$500 - $1,000", apiValue: "500-1000" },
  { id: "1000-5000", label: "$1,000 - $5,000", apiValue: "1000-5000" },
  { id: "5000-plus", label: "$5,000+", apiValue: "5000-plus" },
];

const statuses = [
  { id: "live_auction", label: "Live Auctions" },
  { id: "ending_soon", label: "Auctions Ending Soon" },
  { id: "upcoming_auction", label: "Upcoming Auctions" },
  { id: "buy_now", label: "Buy Now Available" },
];

const conditions = [
  { id: "new", label: "Brand New" },
  { id: "like_new", label: "Like New / Open Box" },
  { id: "open box", label: "Open box" },
  { id: "used", label: "Used" },
  { id: "damaged", label: "Damaged" },
  { id: "for_parts", label: "For Parts" },
];

// --- Interfaces for dynamic safety ---
interface ProductImage {
  public_id: string;
  url: string;
}

interface Product {
  _id: string;
  inventoryId: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  inventoryStatus: string;
  images: ProductImage[];
  totalReview: number;
  type: "for_sale" | "for_auction" | string;
  color: string[];
  quantity: number;
  price?: number;
  reservePrice?: number;
  manufacturer?: string;
  averageReview: number;
  createdAt: string;
  updatedAt: string;
}

interface BrowseResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

interface CategoryResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Array<{
    categoryImage: string | null;
    category: string;
  }>;
}

export default function AuctionListingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();

  // --- Search & Filter States ---
  const [searchInput, setSearchInput] = useState(""); // Local input state
  const [searchTerm, setSearchTerm] = useState("");   // Debounced or active trigger search term
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  
  const [minBid, setMinBid] = useState("");
  const [maxBid, setMaxBid] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search input to lower API load
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // --- Fetch Categories ---
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery<CategoryResponse>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/categories`
      );
      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to fetch categories.");
      }
      return result;
    },
  });

  // Extract category names from response and add "All Products"
  const categories = ["All Products", ...(categoriesData?.data?.map((item) => item.category) || [])];

  // --- TanStack Query Integration ---
  const { data: response, isLoading, isFetching, isError } = useQuery<BrowseResponse>({
    queryKey: [
      "browseProducts",
      searchTerm,
      selectedCategory,
      selectedPriceRange,
      selectedStatus,
      selectedCondition,
      minBid,
      maxBid,
      currentPage,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (searchTerm) queryParams.append("searchTerm", searchTerm);
      if (selectedCategory && selectedCategory !== "All Products") {
        queryParams.append("category", selectedCategory);
      }
      if (selectedPriceRange) queryParams.append("priceRange", selectedPriceRange);
      
      // Pass multi-select arrays as comma-separated values matching backend splits
      if (selectedCondition.length > 0) {
        queryParams.append("condition", selectedCondition.join(","));
      }
      if (selectedStatus.length > 0) {
        queryParams.append("status", selectedStatus.join(","));
      }

      if (minBid) queryParams.append("minBid", minBid);
      if (maxBid) queryParams.append("maxBid", maxBid);

      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", "12");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/browse?${queryParams.toString()}`
      );
      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to fetch products.");
      }
      return result;
    },
  });

  const products = response?.data || [];
  const meta = response?.meta;

  // --- Wishlist Mutation ---
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!token) throw new Error("Please log in to add items to your wishlist.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
          type: "wishlist",
        }),
      });

      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to add product to wishlist.");
      }
      return result;
    },
    onSuccess: (_, productId) => {
      const product = products.find(p => p._id === productId);
      toast.success(`${product?.title || "Product"} added to wishlist successfully!`);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Add to wishlist failed.");
    },
  });

  // --- Handlers ---
  const handleCheckboxChange = (
    id: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setCurrentPage(1);
    if (list.includes(id)) {
      setList(list.filter((item) => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleClearAll = () => {
    setSelectedPriceRange(null);
    setSelectedStatus([]);
    setSelectedCondition([]);
    setMinBid("");
    setMaxBid("");
    setSearchInput("");
    setSearchTerm("");
    setSelectedCategory("All Products");
    setCurrentPage(1);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleWishlistClick = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation(); // Prevent card click navigation
    addToWishlistMutation.mutate(productId);
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc] py-8 font-sans antialiased text-[#1e293b]">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          
          {/* ================= LEFT SIDEBAR FILTERS ================= */}
          <aside className="space-y-4">
            
            {/* Categories Box */}
            <div className="rounded-[8px] border border-[#dce6f5] bg-white p-5 shadow-sm">
              <h3 className="text-[14px] font-bold text-[#111827] mb-3">Categories</h3>
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-[#ff6b1a]" />
                </div>
              ) : (
                <ul className="space-y-2 text-[13px]">
                  {categories.map((cat) => (
                    <li 
                      key={cat} 
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`cursor-pointer transition-colors ${
                        selectedCategory === cat 
                          ? "font-bold text-[#0b57d0]" 
                          : "text-[#6b7280] hover:text-[#111827]"
                      }`}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Accordion Filter Section */}
            <div className="rounded-[8px] border border-[#dce6f5] bg-white p-5 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
                <h3 className="text-[14px] font-bold text-[#111827] flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-slate-500" /> Filters
                </h3>
                <button onClick={handleClearAll} className="text-[11px] font-medium text-[#0b57d0] hover:underline">
                  Clear All
                </button>
              </div>

              {/* Price Ranges Radio selection */}
              <div>
                <div className="flex items-center justify-between text-[13px] font-bold text-[#111827] mb-3">
                  <span>Price Range</span>
                  <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
                </div>
                <div className="space-y-2.5">
                  {retailValues.map((v) => (
                    <label key={v.id} className="flex items-center gap-2.5 text-[12px] text-[#4b5563] cursor-pointer">
                      <input 
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === v.apiValue}
                        onChange={() => {
                          setSelectedPriceRange(v.apiValue);
                          setCurrentPage(1);
                        }}
                        className="h-4 w-4 border-[#dce6f5] text-[#ff6b1a] focus:ring-[#ff6b1a]" 
                      />
                      <span>{v.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status checkboxes */}
              <div>
                <div className="flex items-center justify-between text-[13px] font-bold text-[#111827] mb-3">
                  <span>Listing Type / Status</span>
                  <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
                </div>
                <div className="space-y-2.5">
                  {statuses.map((s) => (
                    <label key={s.id} className="flex items-center gap-2.5 text-[12px] text-[#4b5563] cursor-pointer w-full">
                      <input 
                        type="checkbox"
                        checked={selectedStatus.includes(s.id)}
                        onChange={() => handleCheckboxChange(s.id, selectedStatus, setSelectedStatus)}
                        className="h-4 w-4 rounded border-[#dce6f5] text-[#ff6b1a] focus:ring-[#ff6b1a]" 
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition Section */}
              <div>
                <div className="flex items-center justify-between text-[13px] font-bold text-[#111827] mb-3">
                  <span>Condition</span>
                  <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
                </div>
                <div className="space-y-2.5">
                  {conditions.map((c) => (
                    <label key={c.id} className="flex items-center gap-2.5 text-[12px] text-[#4b5563] cursor-pointer w-full">
                      <input 
                        type="checkbox" 
                        checked={selectedCondition.includes(c.id)}
                        onChange={() => handleCheckboxChange(c.id, selectedCondition, setSelectedCondition)}
                        className="h-4 w-4 rounded border-[#dce6f5] text-[#ff6b1a] focus:ring-[#ff6b1a]"
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bid pricing scale limits */}
              <div>
                <div className="flex items-center justify-between text-[13px] font-bold text-[#111827] mb-3">
                  <span>Filter by Bids</span>
                  <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-2.5 text-[12px] text-[#9ca3af]">$</span>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={minBid}
                      onChange={(e) => {
                        setMinBid(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-[4px] border border-[#dce6f5] py-2 pl-6 pr-2 text-[12px] focus:outline-none focus:border-[#ff6b1a]"
                    />
                  </div>
                  <span className="text-[#9ca3af] text-[12px]">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-2.5 text-[12px] text-[#9ca3af]">$</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={maxBid}
                      onChange={(e) => {
                        setMaxBid(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full rounded-[4px] border border-[#dce6f5] py-2 pl-6 pr-2 text-[12px] focus:outline-none focus:border-[#ff6b1a]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT MAIN PRODUCT GRID ================= */}
          <section className="space-y-4">
            
            {/* Top Row with Pagination stats & Search Form */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[13px] text-[#4b5563] self-start sm:self-auto">
                {isLoading ? (
                  <span>Fetching total inventories count...</span>
                ) : (
                  <span>
                    Showing <span className="font-bold text-[#111827]">{(currentPage - 1) * 12 + 1} - {Math.min(currentPage * 12, meta?.total || 0)}</span> of <span className="font-bold text-[#111827]">{meta?.total || 0}</span> lots
                  </span>
                )}
              </div>
              <form onSubmit={handleManualSearch} className="flex w-full sm:max-w-[580px] items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                  <input
                    type="text"
                    placeholder="Search products, brands, conditions..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full rounded-[4px] border border-[#dce6f5] bg-white py-2 pl-9 pr-4 text-[13px] focus:outline-none focus:border-[#ff6b1a] shadow-sm"
                  />
                </div>
                <button 
                  type="submit"
                  className="rounded-[4px] bg-[#ff6b1a] px-5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#e55a00]"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Main Dynamic Viewport states */}
            {isLoading || isFetching ? (
              <div className="min-h-[500px] flex items-center justify-center rounded-xl bg-white border border-[#dce6f5]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-[#ff6b1a]" />
                  <p className="text-xs text-slate-500 font-semibold">Updating browse parameters...</p>
                </div>
              </div>
            ) : isError ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center rounded-xl bg-white border border-[#dce6f5] p-6 text-center">
                <p className="text-red-500 font-bold">Failed to sync listing.</p>
                <p className="text-xs text-slate-500 mt-1">Check network pathways or check connection metrics.</p>
              </div>
            ) : products.length === 0 ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center rounded-xl bg-white border border-[#dce6f5] p-6 text-center">
                <p className="text-slate-700 font-bold text-base">No Matching Inventories Found</p>
                <p className="text-xs text-slate-400 mt-1">Try relaxing active filter boundaries or category indexes.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => {
                    const isAuction = product.type === "for_auction";
                    const isForSale = product.type === "for_sale";
                    
                    const priceLabel = isAuction ? "Reserve Price" : "Current Price";
                    const displayPrice = isAuction ? product.reservePrice : product.price;
                    const primaryImage = product.images?.[0]?.url || "/images/placeholder.png";

                    return (
                      <div 
                        key={product._id} 
                        className="group flex flex-col overflow-hidden rounded-[8px] border border-[#dce6f5] bg-white shadow-sm transition-all hover:shadow-md relative"
                      >
                        {/* Wishlist Icon - Only for For Sale products */}
                        {isForSale && (
                          <button
                            onClick={(e) => handleWishlistClick(e, product._id)}
                            disabled={addToWishlistMutation.isPending}
                            className="absolute right-3 top-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Add to Wishlist"
                          >
                            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                          </button>
                        )}

                        {/* Thumbnail wrapper */}
                        <div className="relative h-[200px] w-full bg-[#f8fafc] p-4 flex items-center justify-center">
                          <span className={`absolute left-3 top-3 z-10 rounded px-2 py-0.5 text-[9px] font-bold uppercase text-white ${
                            isAuction ? "bg-[#ff6b1a]" : "bg-[#22c55e]"
                          }`}>
                            • {isAuction ? "Auction" : "Direct Sale"}
                          </span>
                          
                          <div className="relative h-full w-full">
                            <Image
                              src={primaryImage}
                              alt={product.title}
                              fill
                              className="object-contain transition-transform group-hover:scale-105"
                            />
                          </div>
                        </div>

                        {/* Product information metadata details */}
                        <div className="flex flex-1 flex-col p-4">
                          <h4 className="text-[14px] font-bold text-[#111827] line-clamp-1">
                            {product.title}
                          </h4>
                          
                          <div className="mt-1 flex items-center justify-between text-[10px] font-bold text-[#9ca3af] uppercase">
                            <span>{product.category}</span>
                            <span className="text-[#0b57d0] font-semibold flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-current" />
                              {product.averageReview || "4.8"}
                            </span>
                          </div>

                          <div className="mt-3 text-[12px] text-slate-500 leading-tight line-clamp-2">
                            {product.description}
                          </div>

                          {/* Bidding/Sale pricing details */}
                          <div className="mt-4 flex items-center justify-between border-t border-[#f1f5f9] pt-3">
                            <div>
                              <div className="text-[10px] text-[#9ca3af] uppercase">{priceLabel}</div>
                              <div className="text-[15px] font-black text-[#111827]">
                                ${displayPrice ? displayPrice.toFixed(2) : "0.00"}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-[#9ca3af] uppercase">Condition</div>
                              <div className="text-[12px] font-bold text-slate-700 capitalize">
                                {product.condition.replace("_", " ")}
                              </div>
                            </div>
                          </div>

                          {/* Target Redirect buttons mapping to correct specifications */}
                          <button 
                            onClick={() => {
                              if (isAuction) {
                                router.push(`/auction-details/${product._id}`);
                              } else if (isForSale) {
                                router.push(`/product-details/${product._id}`);
                              }
                            }}
                            className={`mt-4 w-full rounded-[4px] py-2 text-center text-[12px] font-bold text-white transition-colors ${
                              isAuction 
                                ? "bg-[#ff6b1a] hover:bg-[#e55a00]" 
                                : "bg-[#003da5] hover:bg-[#002b75]"
                            }`}
                          >
                            {isAuction ? "View Auction Product" : "View Product"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dynamic Pagination Footer */}
                {meta && meta.totalPage > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2 border-t border-[#dce6f5] pt-6">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-md text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Previous
                    </button>
                    {Array.from({ length: meta.totalPage }).map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                            currentPage === pageNum
                              ? "bg-[#ff6b1a] text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.totalPage))}
                      disabled={currentPage === meta.totalPage}
                      className="px-4 py-2 border rounded-md text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}

          </section>
        </div>
      </div>
    </main>
  );
}