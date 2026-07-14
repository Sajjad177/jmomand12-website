"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Heart, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardShell } from "./dashboard-shell";
import { useDashboardWishlist, useRemoveWishlistItem } from "../hooks/useDashboardData";
import { getTimeUntil } from "../utils";

export function DashboardWishlistPage() {
  const wishlist = useDashboardWishlist();
  const removeItem = useRemoveWishlistItem();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const items = wishlist.data ?? [];
    if (!query.trim()) return items;

    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      const product = item.productId;
      return [product.title, product.category, product.inventoryId]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized));
    });
  }, [query, wishlist.data]);

  async function handleRemove(id: string) {
    try {
      await removeItem.mutateAsync(id);
      toast.success("Removed from wishlist.");
    } catch {
      toast.error("We couldn't remove this item right now.");
    }
  }

  return (
    <DashboardShell
      title="Wishlist"
      description="Keep an eye on saved lots and jump back into active auctions quickly."
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#dce6f5] bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search wishlist items..."
                className="h-12 rounded-xl border-[#dce6f5] pl-11"
              />
            </div>
            <Button type="button" variant="outline" className="h-12 rounded-xl border-[#dce6f5] text-[#6b7280]">
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {wishlist.isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-[345px] rounded-2xl" />
            ))}
          </div>
        ) : wishlist.isError ? (
          <div className="rounded-2xl border border-[#fecaca] bg-[#fff7f7] p-6 text-[#991b1b]">
            We couldn&apos;t load your wishlist right now.
          </div>
        ) : filteredItems.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const product = item.productId;
              const href = "/category";

              return (
                <article key={item._id} className="overflow-hidden rounded-2xl border border-[#dce6f5] bg-white shadow-sm">
                  <div className="relative h-[140px] bg-[#f3f4f6]">
                    {product.images?.[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void handleRemove(item._id)}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#111827] shadow-sm"
                      aria-label={`Remove ${product.title} from wishlist`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="absolute left-3 top-3 rounded-md bg-[#fff7ed] px-3 py-1 text-xs font-semibold text-[#ff6900]">
                      Ending Soon
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                        {product.inventoryId}
                      </p>
                      <h2 className="mt-2 text-lg font-semibold text-[#171717]">{product.title}</h2>
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-[#6b7280]">Category</p>
                        <p className="mt-1 text-base font-semibold text-[#111827]">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-[#6b7280]">Saved</p>
                        <p className="mt-1 text-sm font-medium text-[#111827]">
                          {getTimeUntil(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    <Button asChild className="h-12 w-full rounded-xl bg-[#fe6819] hover:bg-[#e45c12]">
                      <Link href={href}>View Details</Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#dce6f5] bg-white p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7ed] text-[#fe6819]">
              <Heart className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-[#111827]">No wishlist items found</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6b7280]">
              Save products you want to revisit, then manage them here from one place.
            </p>
            <Button asChild className="mt-6 rounded-xl bg-[#fe6819] hover:bg-[#e45c12]">
              <Link href="/category">Browse auctions</Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
