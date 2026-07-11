import Link from "next/link";
import { Check, Heart, Menu, Search, ShoppingCart } from "lucide-react";
import AuthStatusButton from "@/features/auth/components/AuthStatusButton";

import { SiteBrand } from "./site-brand";

export function SiteHeader() {
  return (
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
            <div className="flex h-11 w-full max-w-[612px] items-center rounded-[6px] border-2 border-[#dce6f5] bg-white px-3 shadow-[0_4px_12px_rgba(13,10,44,0.06)]">
              <Search className="mr-3 h-4 w-4 text-[#6b7280]" />
              <input
                className="font-poppins flex-1 border-0 bg-transparent text-[15px] text-[#6b7280] outline-none placeholder:text-[#6b7280]"
                placeholder="Search ..."
              />
              <button className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#fe6819] text-white">
                <Search className="h-4 w-4" />
              </button>
            </div>
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
              href="/product-details"
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
  );
}
