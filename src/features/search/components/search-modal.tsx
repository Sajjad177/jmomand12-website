"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Loader2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { browseProductsForSearch } from "../api/search.api";

type SearchModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatCurrency(value?: number) {
  if (value == null) return "View details";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function getProductHref(type: string, id: string) {
  return type === "for_auction" ? `/auction-details/${id}` : `/product-details/${id}`;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm.trim());
  const canSearch = deferredSearchTerm.length >= 2;

  const searchQuery = useQuery({
    queryKey: ["search-modal-products", deferredSearchTerm],
    queryFn: () => browseProductsForSearch(deferredSearchTerm),
    enabled: canSearch,
    staleTime: 30_000,
  });

  const results = useMemo(() => searchQuery.data?.data ?? [], [searchQuery.data]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSearchTerm("");
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl rounded-3xl border-[#dce6f5] p-0 sm:max-w-3xl">
        <div className="overflow-hidden rounded-3xl bg-white">
          <div className="border-b border-[#e5edf8] bg-[#f8fbff] px-6 py-5">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#111827]">Search the marketplace</DialogTitle>
              <DialogDescription className="text-sm text-[#64748b]">
                Find auction lots and buy-now products by title, category, or description.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-6">
            <div className="flex items-center gap-3 rounded-2xl border border-[#dce6f5] bg-[#f8fbff] px-4 py-3 shadow-sm">
              <Search className="h-5 w-5 text-[#6b7280]" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search for TVs, appliances, furniture, tools..."
                className="h-auto border-0 bg-transparent px-0 py-0 text-base text-[#111827] shadow-none focus-visible:ring-0"
                autoFocus
              />
              <div className="hidden rounded-lg bg-white px-3 py-1 text-xs font-medium text-[#64748b] md:block">
                Enter at least 2 characters
              </div>
            </div>

            <div className="mt-5 min-h-[320px]">
              {!canSearch ? (
                <div className="flex h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#dce6f5] bg-[#fcfdff] text-center">
                  <div className="rounded-full bg-[#eef4ff] p-4 text-[#003da5]">
                    <Search className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-[#111827]">Start typing to search</p>
                  <p className="mt-2 max-w-md text-sm text-[#64748b]">
                    Search results are optimized for quick discovery and update as you type.
                  </p>
                </div>
              ) : searchQuery.isLoading ? (
                <div className="flex h-[320px] items-center justify-center rounded-2xl border border-[#dce6f5] bg-[#fcfdff]">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#475569]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching products...
                  </div>
                </div>
              ) : searchQuery.isError ? (
                <div className="flex h-[320px] flex-col items-center justify-center rounded-2xl border border-[#fecaca] bg-[#fff7f7] text-center">
                  <p className="text-lg font-semibold text-[#991b1b]">Search is temporarily unavailable</p>
                  <p className="mt-2 max-w-md text-sm text-[#b91c1c]">
                    We couldn&apos;t reach the product search API. Please try again in a moment.
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="flex h-[320px] flex-col items-center justify-center rounded-2xl border border-[#dce6f5] bg-[#fcfdff] text-center">
                  <p className="text-lg font-semibold text-[#111827]">No matching products found</p>
                  <p className="mt-2 max-w-md text-sm text-[#64748b]">
                    Try a broader search term or a different product category.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((product) => {
                    const primaryImage = product.images?.[0]?.url || "/images/login.jpg";
                    const price = product.type === "for_auction" ? product.reservePrice : product.price;

                    return (
                      <Link
                        key={product._id}
                        href={getProductHref(product.type, product._id)}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-4 rounded-2xl border border-[#dce6f5] bg-white p-4 transition hover:border-[#003da5] hover:bg-[#f8fbff]"
                      >
                        <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-[#f3f6fb]">
                          <Image src={primaryImage} alt={product.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-[#eef4ff] px-2 py-1 text-[10px] font-bold uppercase text-[#003da5]">
                              {product.type === "for_auction" ? "Auction" : "Buy Now"}
                            </span>
                            <span className="text-xs uppercase tracking-wide text-[#94a3b8]">
                              {product.category}
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-1 text-base font-semibold text-[#111827]">
                            {product.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm text-[#64748b]">
                            {product.description || "View this item for full details and availability."}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#111827]">{formatCurrency(price)}</p>
                          <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#fe6819]">
                            Open
                            <ArrowUpRight className="h-3 w-3" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
