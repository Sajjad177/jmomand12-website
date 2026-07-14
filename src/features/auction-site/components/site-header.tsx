"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Heart, Menu, Search, ShoppingCart } from "lucide-react";
import AuthStatusButton from "@/features/auth/components/AuthStatusButton";
import { SearchModal } from "@/features/search/components/search-modal";
import { SiteBrand } from "./site-brand";

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        Boolean(target?.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }

      if (!isTypingTarget && event.key === "/") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="relative z-50 bg-[#121a2a] text-white">
        <div className="container flex h-6 items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <Check className="h-3 w-3" />
            <span>Free Shipping On All Orders Over $50</span>
          </div>
          <div>Contact: (808) 555-0111</div>
        </div>

        <div className="bg-black">
          <div className="container flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="w-fit">
              <SiteBrand />
            </Link>

            <div className="flex flex-1 justify-center px-0 lg:px-6">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-11 w-full max-w-[612px] items-center rounded-[10px] border-2 border-[#dce6f5] bg-white px-3 shadow-[0_4px_12px_rgba(13,10,44,0.06)] transition hover:border-[#003da5] hover:shadow-[0_10px_24px_rgba(0,61,165,0.12)]"
              >
                <Search className="mr-3 h-4 w-4 text-[#6b7280]" />
                <div className="flex-1 text-left text-[15px] text-[#6b7280]">
                  Search lots, categories, and products...
                </div>
                <div className="hidden rounded-md border border-[#dce6f5] bg-[#f8fbff] px-2 py-1 text-[11px] font-semibold text-[#64748b] md:block">
                  Ctrl/⌘ K
                </div>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/category"
                className="flex h-11 items-center gap-3 rounded-[6px] bg-white px-4 text-[13px] font-medium text-[#111827]"
              >
                <Menu className="h-4 w-4" />
                All Categories
              </Link>
              <Link
                href="/cart"
                className="flex h-11 items-center gap-2 rounded-[6px] bg-white px-4 text-[13px] font-medium text-[#111827]"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#fe6819] px-1 text-[10px] text-white">
                  2
                </span>
              </Link>
              <button className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-white text-[#111827]">
                <Heart className="h-4 w-4" />
              </button>
              <AuthStatusButton />
            </div>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
