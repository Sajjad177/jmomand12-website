"use client";

import { CartApiResponse } from "@/app/(website)/cart/_components/product-cart";
import { AuthRequiredModal } from "@/components/auth-required-modal";
import AuthStatusButton from "@/features/auth/components/AuthStatusButton";
import { useDashboardWishlist } from "@/features/dashboard/hooks/useDashboardData";
import { SearchModal } from "@/features/search/components/search-modal";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteBrand } from "./site-brand";

// Components & UI Elements from shadcn/ui Ecosystem
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Lucide Icons
import {
  Check,
  ChevronRight,
  Facebook,
  Gavel,
  Heart,
  Home,
  Info,
  Instagram,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  Phone,
  Search,
  ShoppingCart,
  Twitter,
} from "lucide-react";
import Image from "next/image";

// Semantic Category Configuration Data
const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Tools",
  "Jewelry",
  "Vehicles",
  "Fashion",
  "Industrial",
  "Office",
  "Collectibles",
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [authRequiredModalOpen, setAuthRequiredModalOpen] = useState(false);

  // Data Fetching Infrastructure (Retained)
  const wishlist = useDashboardWishlist();
  const items = wishlist.data ?? [];
  const { data: session } = useSession();
  const token = session?.accessToken;

  const handleProtectedNavigation = (path: string) => {
    if (session) {
      router.push(path);
      return;
    }

    setAuthRequiredModalOpen(true);
  };

  const { data: response } = useQuery<CartApiResponse>({
    queryKey: ["userCartData"],
    queryFn: async () => {
      if (!token) throw new Error("Authentication token not identified.");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Failed to retrieve cart items.");
      }
      return result;
    },
    enabled: !!token,
  });

  const cartItems = response?.data || [];

  // Handle Mobile Form Submit
  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileSearchQuery.trim()) return;

    // Redirects directly to your search page without triggering a modal
    router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
  };

  // Global Keyboard Shortcuts listeners (Retained functionality for desktop)
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
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#000000] text-white backdrop-blur-md transition-all duration-300">
        {/* ==========================================
            TOP ANNOUNCEMENT BAR (Desktop & Tablet)
           ========================================== */}
        <div className="hidden border-b border-slate-800 bg-[#111827] text-slate-400 md:block">
          <div className="container mx-auto flex h-9 items-center justify-between px-4 text-[11px] font-medium tracking-wide">
            <div className="flex items-center gap-2 select-none">
              <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
              <span className="text-slate-300">
                Free Shipping On All Orders Over $50
              </span>
            </div>
            <div className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Phone className="h-3 w-3 text-slate-400" />
              <a href="tel:8085550111">Contact: (808) 555-0111</a>
            </div>
          </div>
        </div>

        {/* ==========================================
            MAIN HEADER NAVIGATION CONTAINER
           ========================================== */}
        <div className="container bg-[#000000] mx-auto w-full py-3 md:py-4">
          {/* DESKTOP & TABLET VIEWPORT LAYOUT */}
          <div className="hidden md:flex md:items-center md:justify-between md:gap-4 lg:gap-6">
            {/* Left: Brand Identity */}
            <Link
              href="/"
              className="flex-shrink-0 transition-transform active:scale-98"
            >
              <Image src={"/logo.png"} alt="logo" width={900} height={900} className="w-28 " />
            </Link>

            {/* Center: Search Trigger Input */}
            <div className="flex flex-1 justify-center max-w-xl lg:max-w-2xl px-4 lg:px-8">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="group flex h-11 w-full items-center rounded-xl border border-slate-800 bg-slate-900/40 px-3.5 shadow-inner transition-all duration-300 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-blue-500/[0.02] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-[#0f172a]"
                aria-label="Search auctions and products"
              >
                <Search className="mr-2.5 h-4 w-4 text-slate-500 transition-colors duration-300 group-hover:text-blue-400" />
                <span className="flex-1 text-left text-xs font-medium text-slate-400 select-none transition-colors duration-300 group-hover:text-slate-300">
                  Search auctions and products...
                </span>
                <kbd className="hidden items-center gap-0.5 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 font-mono text-[9px] font-bold tracking-wide text-slate-500 shadow-sm transition-colors duration-300 group-hover:border-slate-700 group-hover:text-slate-400 sm:flex">
                  <span className="text-[10px] leading-none">⌘</span>
                  <span className="leading-none">K</span>
                </kbd>
              </button>
            </div>

            {/* Right: Functional Core Action Controls */}
            <div className="flex flex-shrink-0 items-center gap-2 lg:gap-3">
              <Link
                href="/category"
                className="hidden xl:flex h-11 items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900 px-4 text-xs font-semibold tracking-wide text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800 active:scale-95"
              >
                <Layers className="h-4 w-4 text-blue-400" />
                All Categories
              </Link>

              {session ? (
                <Link
                  href="/cart"
                  className="group relative flex h-11 items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900 px-4 text-xs font-semibold tracking-wide text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800 active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4 text-slate-400 transition-colors group-hover:text-white" />
                  <span className="hidden lg:inline">Cart</span>
                  <span className="flex h-5 min-w-[20px] animate-pulse items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                    {cartItems.length}
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleProtectedNavigation("/cart")}
                  className="group relative flex h-11 items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900 px-4 text-xs font-semibold tracking-wide text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800 active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4 text-slate-400 transition-colors group-hover:text-white" />
                  <span className="hidden lg:inline">Cart</span>
                  <span className="flex h-5 min-w-[20px] animate-pulse items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                    {cartItems.length}
                  </span>
                </button>
              )}

              {session ? (
                <Link
                  href="/dashboard/wishlist"
                  className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white active:scale-95"
                  aria-label="Wishlist"
                >
                  <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
                  {items?.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                      {items.length}
                    </span>
                  )}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    handleProtectedNavigation("/dashboard/wishlist")
                  }
                  className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 transition-all hover:border-slate-600 hover:bg-slate-800 hover:text-white active:scale-95"
                  aria-label="Wishlist"
                >
                  <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
                  {items?.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                      {items.length}
                    </span>
                  )}
                </button>
              )}

              <div className="border-l border-slate-800 pl-2 lg:pl-3">
                <AuthStatusButton />
              </div>
            </div>
          </div>

          {/* ==========================================
              OPTIMIZED MOBILE CONTAINER (< 768px Layout)
             ========================================== */}
          <div className="flex flex-col gap-3 md:hidden">
            {/* ROW 1: Branding & Action Grid Mapping */}
            <div className="flex items-center justify-between">
              {/* Logo Segment */}
              <Link href="/" className="transition-transform active:scale-98">
                <SiteBrand />
              </Link>

              {/* Mobile Right Controls Segment */}
              <div className="flex items-center gap-2">
                {/* Wishlist Button Link */}
                {session ? (
                  <Link
                    href="/dashboard/wishlist"
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 active:scale-95"
                    aria-label="Wishlist View"
                  >
                    <Heart className="h-4.5 w-4.5" />
                    {items?.length > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-extrabold text-white">
                        {items.length}
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      handleProtectedNavigation("/dashboard/wishlist")
                    }
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 active:scale-95"
                    aria-label="Wishlist View"
                  >
                    <Heart className="h-4.5 w-4.5" />
                    {items?.length > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-extrabold text-white">
                        {items.length}
                      </span>
                    )}
                  </button>
                )}

                {/* Shopping Cart Button Link */}
                {session ? (
                  <Link
                    href="/cart"
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 active:scale-95"
                    aria-label="Shopping Cart View"
                  >
                    <ShoppingCart className="h-4.5 w-4.5" />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[8px] font-extrabold text-white">
                      {cartItems.length}
                    </span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleProtectedNavigation("/cart")}
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 active:scale-95"
                    aria-label="Shopping Cart View"
                  >
                    <ShoppingCart className="h-4.5 w-4.5" />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[8px] font-extrabold text-white">
                      {cartItems.length}
                    </span>
                  </button>
                )}

                {/* Mobile Drawer (Sheet UI Primitive Trigger) */}
                <Sheet
                  open={isMobileMenuOpen}
                  onOpenChange={setIsMobileMenuOpen}
                >
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-white active:scale-95 focus:outline-none"
                      aria-label="Open Structural System Menu"
                    >
                      <Menu className="h-5 w-5" />
                    </button>
                  </SheetTrigger>

                  {/* Sheet Slider Component Area */}
                  <SheetContent
                    side="right"
                    className="w-full max-w-[320px] flex flex-col justify-between border-l border-slate-800 bg-[#0b0f19] p-0 text-white shadow-2xl"
                  >
                    <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
                      {/* Drawer Dynamic Header Context */}
                      <SheetHeader className="p-5 border-b border-slate-800 flex flex-row items-center justify-between space-y-0">
                        <SheetTitle className="text-left">
                          <SiteBrand />
                        </SheetTitle>
                      </SheetHeader>

                      {/* Navigation Body */}
                      <div className="px-4 py-4">
                        <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-2 mb-2">
                          Navigation
                        </p>
                        <nav className="space-y-1">
                          {[
                            { label: "Home", href: "/", icon: Home },
                            {
                              label: "Auctions",
                              href: "/auctions",
                              icon: Gavel,
                            },
                            {
                              label: "Products",
                              href: "/products",
                              icon: Package,
                            },
                            { label: "Contact", href: "/contact", icon: Phone },
                            { label: "About", href: "/about", icon: Info },
                          ].map((route) => {
                            const IconComp = route.icon;
                            const isActive = pathname === route.href;
                            return (
                              <Link
                                key={route.label}
                                href={route.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                  isActive
                                    ? "bg-[#FF6900] text-white shadow-lg shadow-orange-500/20"
                                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                }`}
                              >
                                <IconComp
                                  className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`}
                                />
                                {route.label}
                              </Link>
                            );
                          })}
                        </nav>

                        {/* Collapsible Category Accordion Implementation */}
                        <div className="mt-6">
                          <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-2 mb-1">
                            Explore
                          </p>
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full border-none"
                          >
                            <AccordionItem
                              value="categories"
                              className="border-none"
                            >
                              <AccordionTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-white hover:no-underline [&[data-state=open]]:bg-slate-900 [&[data-state=open]]:text-white">
                                <div className="flex items-center gap-3">
                                  <Layers className="h-4 w-4 text-slate-400" />
                                  <span>Categories</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-1 pb-2 pl-9 pr-2 space-y-1">
                                {CATEGORIES.map((category) => (
                                  <Link
                                    key={category}
                                    href={`/category/${category.toLowerCase()}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors group"
                                  >
                                    <span>{category}</span>
                                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0" />
                                  </Link>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>

                        {/* Adaptive Authentication State Context Drawer UI */}
                        <div className="mt-6 pt-6 border-t border-slate-800">
                          <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-2 mb-2">
                            Account
                          </p>
                          {session ? (
                            <div className="space-y-1">
                              <Link
                                href="/dashboard"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-white"
                              >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                              </Link>
                              <Link
                                href="/dashboard/orders"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-white"
                              >
                                <Package className="h-4 w-4" />
                                Orders
                              </Link>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  signOut();
                                }}
                                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <LogOut className="h-4 w-4" />
                                Logout
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2 px-2 mt-1">
                              <Link
                                href="/auth/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex h-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 active:scale-95 transition-transform"
                              >
                                Login
                              </Link>
                              <Link
                                href="/auth/register"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex h-9 items-center justify-center rounded-xl bg-[#FF6900] text-xs font-bold text-white shadow-md active:scale-95 transition-transform"
                              >
                                Register
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Fixed Structural Menu Drawer Footer Component */}
                    <div className="p-5 border-t border-slate-800 bg-[#080b12] space-y-4">
                      <div className="space-y-2 text-xs font-medium text-slate-400">
                        <a
                          href="tel:8085550111"
                          className="flex items-center gap-2.5 hover:text-white"
                        >
                          <Phone className="h-3.5 w-3.5 text-blue-400" />
                          <span>(808) 555-0111</span>
                        </a>
                        <a
                          href="mailto:support@discountdeals.com"
                          className="flex items-center gap-2.5 hover:text-white"
                        >
                          <Mail className="h-3.5 w-3.5 text-blue-400" />
                          <span>support@discountdeals.com</span>
                        </a>
                      </div>
                      <div className="flex items-center gap-3 pt-1 text-slate-400">
                        <a
                          href="#"
                          className="hover:text-white transition-colors"
                        >
                          <Facebook className="h-4 w-4" />
                        </a>
                        <a
                          href="#"
                          className="hover:text-white transition-colors"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                        <a
                          href="#"
                          className="hover:text-white transition-colors"
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* ROW 2: Native Mobile Search Form Input (Directly type & search) */}
            <form onSubmit={handleMobileSearch} className="w-full">
              <div className="relative flex h-10 w-full items-center rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 transition-all focus-within:border-slate-700 focus-within:bg-slate-900">
                <Search className="mr-2.5 h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search lots, categories, products..."
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 outline-none w-full"
                  aria-label="Search field"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Embedded Operational Dialog / Modal (Retained configuration mapping for Desktop / Tablet) */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <AuthRequiredModal
        open={authRequiredModalOpen}
        onOpenChange={setAuthRequiredModalOpen}
      />
    </>
  );
}
