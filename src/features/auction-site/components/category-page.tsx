import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

import { AuctionPrimaryButton } from "./auction-buttons";
import { AuctionProductCard } from "./auction-product-card";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { categoriesNav, categoryFilters, categoryProducts } from "../data";

export function CategoryPage() {
  return (
    <main className="bg-[#f7f9fc]">
      <SiteHeader />

      <section className="bg-[linear-gradient(180deg,#00173f_0%,#003da5_100%)] py-14 text-white">
        <div className="auction-shell text-center">
          <h1 className="text-[64px] font-bold leading-[1.2]">
            Appliance Auctions
          </h1>
          <p className="mx-auto mt-3 max-w-[576px] text-[18px] leading-7 text-[#eef4ff]">
            Source premium, overstock, and returned appliances directly from top
            retailers. High-margin inventory available now.
          </p>
        </div>
      </section>

      <section className="auction-shell py-10">
        <div className="grid gap-4 xl:grid-cols-[332px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="auction-card overflow-hidden rounded-[8px] bg-white">
              <div className="border-b border-[#e2e8f0] px-5 py-5">
                <h2 className="text-[18px] font-bold text-[#111827]">
                  Categories
                </h2>
              </div>
              <div className="space-y-2 px-5 py-4">
                {categoriesNav.map((category) => (
                  <button
                    key={category}
                    className={`block w-full rounded-[8px] px-3 py-2 text-left text-[14px] ${
                      category === "Appliances"
                        ? "font-medium text-[#003da5]"
                        : "text-[#6b7280]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="border-t border-[#e2e8f0] px-5 py-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[18px] font-bold text-[#0f172a]">
                    Filters
                  </h3>
                  <button className="text-[12px] font-semibold text-[#003da5]">
                    Clear All
                  </button>
                </div>
              </div>

              <div className="space-y-4 px-5 pb-5">
                {categoryFilters.map((group, index) => (
                  <div
                    key={group.title}
                    className={index ? "border-t border-[#e2e8f0] pt-4" : ""}
                  >
                    <button className="flex w-full items-center justify-between px-2 py-2 text-left">
                      <span className="text-[15px] font-semibold text-[#0f172a]">
                        {group.title}
                      </span>
                      <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
                    </button>
                    <div className="mt-2 space-y-3 px-2">
                      {group.options.map((option) => (
                        <label
                          key={option.label}
                          className="flex items-center justify-between gap-3 text-[12px] text-[#475569]"
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              defaultChecked={option.checked}
                              className="h-3.5 w-3.5 rounded border border-[#dce6f5]"
                            />
                            {option.label}
                          </span>
                          {option.count ? <span>{option.count}</span> : null}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="border-t border-[#e2e8f0] pt-4">
                  <button className="flex w-full items-center justify-between px-2 py-2 text-left">
                    <span className="text-[15px] font-semibold text-[#0f172a]">
                      Current Bid
                    </span>
                    <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
                  </button>
                  <div className="mt-3 px-2">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="rounded-[6px] border border-[#dce6f5] px-3 py-2 text-[12px]"
                        placeholder="$ Min"
                      />
                      <input
                        className="rounded-[6px] border border-[#dce6f5] px-3 py-2 text-[12px]"
                        placeholder="$ Max"
                      />
                    </div>
                    <div className="mt-4 px-1">
                      <div className="relative h-1 rounded-full bg-[#dce6f5]">
                        <div className="absolute left-[20%] right-[25%] h-1 rounded-full bg-[#fe6819]" />
                        <div className="absolute left-[18%] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-[#fe6819] bg-white" />
                        <div className="absolute right-[23%] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-[#fe6819] bg-white" />
                      </div>
                    </div>
                    <AuctionPrimaryButton className="mt-6 h-10 w-full text-[12px]">
                      Apply Filters
                    </AuctionPrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <div className="auction-card flex flex-col gap-3 rounded-[8px] bg-white p-4 md:flex-row md:items-center md:justify-between">
              <p className="text-[12px] text-[#6b7280]">
                Showing 1 - 24 of 1,245 lots
              </p>
              <div className="flex flex-1 gap-3 md:max-w-[706px]">
                <div className="flex h-10 flex-1 items-center rounded-[6px] border border-[#dce6f5] px-3 text-[#94a3b8]">
                  <Search className="mr-2 h-4 w-4" />
                  <span className="text-[12px]">
                    Search appliances, brands, lot numbers...
                  </span>
                </div>
                <AuctionPrimaryButton className="h-10 px-6 text-[12px]">
                  Search
                </AuctionPrimaryButton>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 16 }).map((_, index) => (
                <AuctionProductCard
                  key={`category-grid-${index}`}
                  product={categoryProducts[index % categoryProducts.length]}
                  className="shadow-none"
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#e2e8f0] text-[#cbd5e1]">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`flex h-8 w-8 items-center justify-center rounded-[8px] text-[12px] font-semibold ${
                    page === 1
                      ? "bg-[#fe6819] text-white"
                      : "border border-[#dce6f5] text-[#003da5]"
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="px-2 text-[12px] text-[#003da5]">...</span>
              <button className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#dce6f5] text-[12px] font-semibold text-[#003da5]">
                12
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#e2e8f0] text-[#cbd5e1]">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
