"use client";

import Link from "next/link";
import { Layers, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useCategories } from "../hooks/useCategory";

export default function CategoriesDropdown() {
  const [open, setOpen] = useState(false);
  const { data } = useCategories();

  const categories = data?.data ?? [];

  return (
    <div
      className="relative hidden xl:block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm font-medium text-white">
        <Layers className="h-4 w-4 text-blue-400" />
        All Categories
        <ChevronDown
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-14 z-50 w-72 rounded-2xl border bg-white p-2 shadow-2xl">
          {categories.map((category: { category: string }) => (
            <Link
              key={category.category}
              href={`/category?category=${encodeURIComponent(category.category)}`}
              className="flex items-center rounded-xl px-4 py-3 text-sm transition hover:bg-slate-100"
            >
              {category.category}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
