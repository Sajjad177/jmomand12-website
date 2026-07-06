"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Appliances",
    items: "2,850 Items",
    image: "/categories/appliances.jpg",
  },
  {
    name: "Electronics",
    items: "2,850 Items",
    image: "/categories/electronics.png",
  },
  {
    name: "Automotive",
    items: "2,850 Items",
    image: "/categories/automotive.jpg",
  },
  {
    name: "Office",
    items: "2,850 Items",
    image: "/categories/office.jpg",
  },
  {
    name: "Kitchen",
    items: "2,850 Items",
    image: "/categories/kitchen.jpg",
  },
  {
    name: "Furniture",
    items: "2,850 Items",
    image: "/categories/furniture.jpg",
  },
  {
    name: "Overstock",
    items: "2,850 Items",
    image: "/categories/overstock.jpg",
  },
];

export default function BrowseCategories() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 lg:text-5xl">
              Browse Categories
            </h2>

            <p className="mt-3 text-lg text-gray-500 lg:text-xl">
              Find exactly what you&apos;re looking for by category.
            </p>
          </div>

          <Link
            href="/category"
            className="rounded bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
          >
            Explore All
          </Link>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {categories.map((category) => (
            <Link
              href="/category"
              key={category.name}
              className="group cursor-pointer text-center"
            >
              <div className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-[6px] border-[#153B7A] transition duration-300 group-hover:scale-105">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="mt-5 text-2xl font-semibold text-gray-900">
                {category.name}
              </h3>

              <p className="mt-2 text-lg text-orange-500">{category.items}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
