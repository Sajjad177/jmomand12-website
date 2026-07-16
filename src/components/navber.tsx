"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  Truck,
  X,
  Phone,
  ChevronRight,
  LogIn,
} from "lucide-react";
import AuthStatusButton from "@/features/auth/components/AuthStatusButton";
import { SiteBrand } from "../features/auction-site/components/site-brand";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect to shrink/blur navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="w-full sticky top-0 z-50 transition-all duration-300">
      {/* 1. TOP UTILITY BAR (Desktop Only) */}
      <div className="hidden md:block bg-gray-950 text-gray-400 border-b border-white/5 text-[11px] font-medium tracking-wide">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-9 items-center justify-between">
          <div className="flex items-center gap-2 select-none">
            <Truck size={13} className="text-orange-500" />
            <span>Free shipping on all orders over $50</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:8085550111"
              className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors duration-200 rounded px-1 outline-none"
            >
              <Phone size={12} className="text-orange-500" />
              <span>Contact: (808) 555-0111</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div
        className={`w-full border-b transition-all duration-300 ${
          isScrolled
            ? "bg-black/95 backdrop-blur-md border-white/10"
            : "bg-black border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Brand & Actions */}
          <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between gap-4">
            {/* Mobile: Hamburger Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-lg text-white hover:bg-white/10 active:scale-95 transition-all outline-none"
                aria-label="Open Menu"
              >
                <Menu size={22} />
              </button>
            </div>

            {/* Brand Logo / Text */}
            <SiteBrand />

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 justify-center max-w-md xl:max-w-xl">
              <div className="flex w-full items-center rounded-full bg-white/5 border border-white/10 p-1.5 pl-4 focus-within:border-orange-500/80 focus-within:bg-white/10 focus-within:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all duration-300">
                <input
                  type="text"
                  placeholder="Search lots, categories, and products..."
                  className="flex-1 bg-transparent pr-2 text-sm text-white placeholder-gray-400 outline-none w-full"
                />
                <button
                  type="submit"
                  className="rounded-full bg-orange-500 p-2.5 text-white hover:bg-orange-600 active:scale-95 transition-all duration-200"
                  aria-label="Search"
                >
                  <Search size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Right-Side Actions Group */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Desktop Categories trigger */}
              <button className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4.5 py-2 text-xs font-semibold hover:bg-white/10 hover:border-white/20 transition-all text-white outline-none">
                <Menu size={14} />
                <span>All Categories</span>
              </button>

              {/* Wishlist Button (Hidden on extra small devices) */}
              <button
                className="hidden sm:flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white active:scale-95 transition-all outline-none"
                aria-label="My Wishlist"
              >
                <Heart size={18} />
              </button>

              {/* Cart Icon */}
              <Link href="/cart" className="outline-none">
                <button className="relative flex h-9 w-9 md:w-auto md:h-10 md:px-4 items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white active:scale-95 transition-all">
                  <ShoppingCart size={18} />
                  <span className="hidden md:inline text-xs font-semibold">
                    Cart
                  </span>
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-extrabold text-white shadow-md shadow-orange-500/30">
                    0
                  </span>
                </button>
              </Link>

              {/* Profile / Auth Status Button */}
              <div className="flex-shrink-0">
                <AuthStatusButton />
              </div>
            </div>
          </div>

          {/* Mobile-Only Search Row (Directly below logo/actions) */}
          <div className="lg:hidden w-full pb-3">
            <div className="flex w-full items-center rounded-xl bg-white/10 border border-white/10 p-1 pl-3.5 focus-within:border-orange-500/80 focus-within:bg-white/15 transition-all">
              <Search size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search lots, categories, and products..."
                className="flex-1 bg-transparent pr-2 text-xs text-white placeholder-gray-400 outline-none py-1.5"
                aria-label="Search"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. MOBILE SIDEBAR NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Shadow Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Drawer Panel */}
          <div className="relative w-full max-w-[280px] bg-slate-950 p-6 flex flex-col justify-between h-full shadow-2xl border-r border-white/10 animate-in slide-in-from-left duration-250 ease-out">
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest text-orange-500 leading-none">
                    DISCOUNT
                  </span>
                  <span className="text-base font-black text-white tracking-tight leading-none mt-0.5">
                    DEALS
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all outline-none"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="mt-6 flex flex-col gap-1">
                <Link
                  href="/category"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 text-xs font-bold text-gray-200 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Menu size={15} className="text-orange-500" />
                    <span>All Categories</span>
                  </div>
                  <ChevronRight
                    size={13}
                    className="text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all"
                  />
                </Link>

                <Link
                  href="/category"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 text-xs font-bold text-gray-200 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Heart size={15} className="text-orange-500" />
                    <span>My Wishlist</span>
                  </div>
                  <ChevronRight
                    size={13}
                    className="text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all"
                  />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 text-xs font-bold text-gray-200 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={15} className="text-orange-500" />
                    <span>Shopping Cart</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 text-[8px] font-extrabold bg-orange-500 text-white rounded-full">
                      0
                    </span>
                    <ChevronRight
                      size={13}
                      className="text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </Link>
              </nav>
            </div>

            {/* Bottom Contact & Utility Drawer Footer */}
            <div className="pt-5 border-t border-white/10 flex flex-col gap-3 text-[11px] text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <Truck size={13} className="text-orange-500 shrink-0" />
                <span>Free shipping on orders over $50</span>
              </div>
              <a
                href="tel:8085550111"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone size={13} className="text-orange-500 shrink-0" />
                <span>Contact: (808) 555-0111</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
