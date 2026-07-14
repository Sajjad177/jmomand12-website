/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, ChevronUp } from "lucide-react";

// Mock Data matching the image placeholders
const categories = [
  "All Products", "Appliances", "Electronics", "Furniture", 
  "Home & Garden", "Tools", "Outdoor", "Office Furniture", "Bedding & Decor"
];

const retailValues = [
  { id: "under-100", label: "Under $100" },
  { id: "100-500", label: "$100 - $500" },
  { id: "500-1000", label: "$500 - $1,000" },
  { id: "1000-5000", label: "$1,000 - $5,000" },
  { id: "5000-plus", label: "$5,000+" },
];

const statuses = [
  { id: "live", label: "Live Auctions", count: 342 },
  { id: "ending", label: "Auctions Ending Soon", count: 89 },
  { id: "upcoming", label: "Upcoming Auctions", count: 124 },
  { id: "buy-now", label: "Buy Now Available", count: 800 },
];

const conditions = [
  { id: "new", label: "Brand New", count: 45 },
  { id: "like-new", label: "Like New / Open Box", count: 210 },
  { id: "scratch-dent", label: "Scratch & Dent", count: 800 },
  { id: "salvage", label: "Salvage", count: 190 },
];

// 8 mockup products representing the grid in the picture
const mockupProducts = [
  { id: 1, tag: "High-Value", tagBg: "bg-[#22c55e]", image: "/images/chair.jpg", title: "Casio G-Shock Premi...", category: "ELECTRONICS", bids: "4 BIDS", price: "$125.00", timeLeft: "04h 12m" },
  { id: 2, tag: "Ending Soon", tagBg: "bg-[#f59e0b]", image: "/images/table.jpg", title: "Casio G-Shock Premi...", category: "ELECTRONICS", bids: "4 BIDS", price: "$125.00", timeLeft: "04h 12m" },
  { id: 3, tag: "LIVE", tagBg: "bg-[#22c55e]", image: "/images/sofa.jpg", title: "Casio G-Shock Premi...", category: "ELECTRONICS", bids: "4 BIDS", price: "$125.00", timeLeft: "04h 12m" },
  { id: 4, tag: "LIVE", tagBg: "bg-[#22c55e]", image: "/images/lamp.jpg", title: "Casio G-Shock Premi...", category: "ELECTRONICS", bids: "4 BIDS", price: "$125.00", timeLeft: "04h 12m" },
  { id: 5, tag: "LIVE", tagBg: "bg-[#22c55e]", image: "/images/chair.jpg", title: "Casio G-Shock Premi...", category: "ELECTRONICS", bids: "4 BIDS", price: "$125.00", timeLeft: "04h 12m" },
  { id: 6, tag: "Ending Soon", tagBg: "bg-[#f59e0b]", image: "/images/table.jpg", title: "Casio G-Shock Premi...", category: "ELECTRONICS", bids: "4 BIDS", price: "$125.00", timeLeft: "04h 12m" },
  { id: 7, tag: "LIVE", tagBg: "bg-[#22c55e]", image: "/images/sofa.jpg", title: "Casio G-Shock Premi...", category: "ELECTRONICS", bids: "4 BIDS", price: "$125.00", timeLeft: "04h 12m" },
  { id: 8, tag: "Upcoming", tagBg: "bg-[#1e40af]", image: "/images/lamp.jpg", title: "Casio G-Shock Premi...", category: "ELECTRONICS", bids: "4 BIDS", price: "$125.00", timeLeft: "04h 12m" },
];

export default function AuctionListingPage() {
  // States for Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Appliances");
  const [selectedRetail, setSelectedRetail] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(["live"]); // Pre-selected 'Live' from image
  const [selectedCondition, setSelectedCondition] = useState<string[]>(["like-new"]); // Pre-selected from image
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Console log state change helper
  const logCurrentFilters = (updatedFilters?: any) => {
    const current = updatedFilters || {
      searchQuery,
      category: selectedCategory,
      retailValues: selectedRetail,
      statuses: selectedStatus,
      conditions: selectedCondition,
      priceRange: { min: minPrice, max: maxPrice }
    };
    console.log("Active Filters Context:", current);
  };

  // Log on filter change instantly to track user behavior
  useEffect(() => {
    logCurrentFilters();
  }, [selectedCategory, selectedRetail, selectedStatus, selectedCondition]);

  const handleCheckboxChange = (id: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(id)) {
      setList(list.filter(item => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleClearAll = () => {
    setSelectedRetail([]);
    setSelectedStatus([]);
    setSelectedCondition([]);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    console.log("Filters Cleared");
  };

  const handleApplyFiltersSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== Filters Applied Manually ===");
    logCurrentFilters();
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
              <ul className="space-y-2 text-[13px]">
                {categories.map((cat) => (
                  <li 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
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
            </div>

            {/* Dynamic Filter Accordions */}
            <div className="rounded-[8px] border border-[#dce6f5] bg-white p-5 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-2">
                <h3 className="text-[14px] font-bold text-[#111827]">Filters</h3>
                <button onClick={handleClearAll} className="text-[11px] font-medium text-[#0b57d0] hover:underline">
                  Clear All
                </button>
              </div>

              {/* Minimum Retail Value */}
              <div>
                <div className="flex items-center justify-between text-[13px] font-bold text-[#111827] mb-3 cursor-pointer">
                  <span>Minimum Retail Value</span>
                  <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
                </div>
                <div className="space-y-2.5">
                  {retailValues.map((v) => (
                    <label key={v.id} className="flex items-center gap-2.5 text-[12px] text-[#4b5563] cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedRetail.includes(v.id)}
                        onChange={() => handleCheckboxChange(v.id, selectedRetail, setSelectedRetail)}
                        className="h-4 w-4 rounded border-[#dce6f5] text-[#ff6b1a] focus:ring-[#ff6b1a]" 
                      />
                      <span>{v.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Section */}
              <div>
                <div className="flex items-center justify-between text-[13px] font-bold text-[#111827] mb-3 cursor-pointer">
                  <span>Status</span>
                  <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
                </div>
                <div className="space-y-2.5">
                  {statuses.map((s) => (
                    <label key={s.id} className="flex items-center justify-between text-[12px] text-[#4b5563] cursor-pointer w-full">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox"
                          checked={selectedStatus.includes(s.id)}
                          onChange={() => handleCheckboxChange(s.id, selectedStatus, setSelectedStatus)}
                          className="h-4 w-4 rounded border-[#dce6f5] text-[#ff6b1a] focus:ring-[#ff6b1a]" 
                        />
                        <span>{s.label}</span>
                      </div>
                      <span className="text-[#9ca3af] text-[11px]">{s.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition Section */}
              <div>
                <div className="flex items-center justify-between text-[13px] font-bold text-[#111827] mb-3 cursor-pointer">
                  <span>Condition</span>
                  <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
                </div>
                <div className="space-y-2.5">
                  {conditions.map((c) => (
                    <label key={c.id} className="flex items-center justify-between text-[12px] text-[#4b5563] cursor-pointer w-full">
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="checkbox" 
                          checked={selectedCondition.includes(c.id)}
                          onChange={() => handleCheckboxChange(c.id, selectedCondition, setSelectedCondition)}
                          className="h-4 w-4 rounded border-[#dce6f5] text-[#ff6b1a] focus:ring-[#ff6b1a]"
                        />
                        <span>{c.label}</span>
                      </div>
                      <span className="text-[#9ca3af] text-[11px]">{c.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Current Bid Price Range */}
              <div>
                <div className="flex items-center justify-between text-[13px] font-bold text-[#111827] mb-3 cursor-pointer">
                  <span>Current Bid</span>
                  <ChevronUp className="h-4 w-4 text-[#9ca3af]" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-2 text-[12px] text-[#9ca3af]">$</span>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full rounded-[4px] border border-[#dce6f5] py-1.5 pl-6 pr-2 text-[12px] focus:outline-none focus:border-[#ff6b1a]"
                    />
                  </div>
                  <span className="text-[#9ca3af] text-[12px]">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-2 text-[12px] text-[#9ca3af]">$</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full rounded-[4px] border border-[#dce6f5] py-1.5 pl-6 pr-2 text-[12px] focus:outline-none focus:border-[#ff6b1a]"
                    />
                  </div>
                </div>

                {/* Custom Styling for visual range bar slider from image */}
                <div className="mt-4 px-1 relative w-full h-1 bg-[#e2e8f0] rounded">
                  <div className="absolute left-[20%] right-[30%] h-full bg-[#ff6b1a]"></div>
                  <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#ff6b1a] cursor-pointer"></div>
                  <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#ff6b1a] cursor-pointer"></div>
                </div>

                {/* Apply Filters Submission Button */}
                <button 
                  onClick={handleApplyFiltersSubmit}
                  className="mt-6 w-full rounded-[4px] bg-[#ff6b1a] py-2.5 text-center text-[13px] font-bold text-white transition-colors hover:bg-[#e55a00]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT MAIN PRODUCT GRID ================= */}
          <section className="space-y-4">
            
            {/* Top Bar with Pagination info & Search Field */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[13px] text-[#4b5563] self-start sm:self-auto">
                Showing <span className="font-bold text-[#111827]">1 - 24</span> of <span className="font-bold text-[#111827]">1,245</span> lots
              </div>
              <div className="flex w-full sm:max-w-[580px] items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                  <input
                    type="text"
                    placeholder="Search appliances, brands, lot numbers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-[4px] border border-[#dce6f5] bg-white py-2 pl-9 pr-4 text-[13px] focus:outline-none focus:border-[#ff6b1a] shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => console.log("Search Key Triggered:", searchQuery)}
                  className="rounded-[4px] bg-[#ff6b1a] px-5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#e55a00]"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Products Main Grid Layout */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {mockupProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="group flex flex-col overflow-hidden rounded-[8px] border border-[#dce6f5] bg-white shadow-sm transition-all hover:shadow-md"
                >
                  {/* Image wrapper with badge */}
                  <div className="relative h-[200px] w-full bg-[#f8fafc] p-2">
                    <span className={`absolute left-3 top-3 z-10 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white ${product.tagBg}`}>
                      • {product.tag}
                    </span>
                    <div className="relative h-full w-full">
                      {/* logic for image background fallback styling matching image grid */}
                      <div className="absolute inset-0 flex items-center justify-center bg-[#e2e8f0] text-xs text-[#94a3b8] font-semibold">
                        [ {product.tag} Item Image ]
                      </div>
                    </div>
                  </div>

                  {/* Product Metadata & Action Info */}
                  <div className="flex flex-1 flex-col p-4">
                    <h4 className="text-[14px] font-bold text-[#111827] line-clamp-1">
                      {product.title}
                    </h4>
                    <div className="mt-1 flex gap-1.5 text-[10px] font-bold tracking-wider text-[#9ca3af]">
                      <span>{product.category}</span>
                      <span>•</span>
                      <span className="text-[#0b57d0]">{product.bids}</span>
                    </div>

                    {/* Bidding state labels */}
                    <div className="mt-4 flex items-center justify-between border-t border-[#f1f5f9] pt-3">
                      <div>
                        <div className="text-[10px] text-[#9ca3af] uppercase">Current Bid</div>
                        <div className="text-[15px] font-black text-[#111827]">{product.price}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-[#9ca3af] uppercase">Time Left</div>
                        <div className="text-[12px] font-bold text-[#ff6b1a]">{product.timeLeft}</div>
                      </div>
                    </div>

                    {/* Trigger Button */}
                    <button 
                      onClick={() => console.log(`Placing bid process triggered for Product ID: ${product.id}`)}
                      className="mt-4 w-full rounded-[4px] bg-[#ff6b1a] py-2 text-center text-[12px] font-bold text-white transition-colors hover:bg-[#e55a00]"
                    >
                      Place Bid
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}