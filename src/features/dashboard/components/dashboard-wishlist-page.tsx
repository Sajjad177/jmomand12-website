"use client";

import { Heart, Search, SlidersHorizontal } from "lucide-react";
import { DashboardShell } from "./dashboard-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DashboardWishlistPage() {
  return (
    <DashboardShell
      title="Wishlist"
      description="A place for saved items and watchlist intent once the backend exposes customer wishlist endpoints."
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-[#dce6f5] bg-white p-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
            <Input
              placeholder="Search wishlist items..."
              className="h-12 rounded-xl border-[#dce6f5] pl-11"
              disabled
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl border-[#dce6f5] text-[#6b7280]"
            disabled
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="rounded-2xl border border-dashed border-[#dce6f5] bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7ed] text-[#fe6819]">
            <Heart className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-[#111827]">
            Wishlist support is waiting on a backend endpoint
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6b7280]">
            The designs include a fully visual wishlist grid, but the current API surface does not yet expose
            saved-item, watchlist, or remove-from-wishlist operations for customer accounts. This page is wired as
            the future destination and stays intentionally honest until that contract exists.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
