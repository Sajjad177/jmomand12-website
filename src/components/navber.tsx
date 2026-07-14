"use client";

import Image from "next/image";
import { Search, ShoppingCart, Heart, Menu, Truck } from "lucide-react";
import AuthStatusButton from "@/features/auth/components/AuthStatusButton";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-[#1F2937] text-white">
        <div className="mx-40 flex h-12 items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs">
            <Truck size={15} />
            <span>Free shipping on all orders over $50</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-300">Contact:</span>
            <span className="font-medium">(808) 555-0111</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-black">
        <div className="mx-40 flex h-28 items-center justify-between gap-8 px-6 lg:px-8">
          <div>
            <Image width={150} height={80} alt="logo" src={"/logo.png"} />
          </div>
          {/* Search */}
          <div className="hidden flex-1 lg:flex justify-center">
            <div className="flex w-full max-w-xl items-center rounded-md bg-white p-2 shadow">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent px-2 text-gray-700 outline-none"
              />

              <button className="rounded-md bg-orange-500 p-2 text-white transition hover:bg-orange-600">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Categories */}
            <button className="hidden lg:flex items-center gap-3 rounded-md bg-white px-5 py-3 font-medium text-gray-800 hover:bg-gray-100">
              <Menu size={18} />
              <span>All Categories</span>
            </button>

            {/* Cart */}
            <Link href={"/cart"}>
            <button className="relative flex h-12 items-center gap-2 rounded-lg bg-white px-4 hover:bg-gray-100 text-black">
              <ShoppingCart size={20} />
              <span className="text-sm font-medium">Cart</span>

              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-semibold text-white">
                2
              </span>
            </button>
            </Link>

            {/* Wishlist */}
            <button className="flex h-12 w-12 items-center justify-center rounded-lg bg-white hover:bg-gray-100 text-black">
              <Heart size={20} />
            </button>

            {/* Profile */}
            <AuthStatusButton />
          </div>
        </div>
      </div>
    </header>
  );
}
