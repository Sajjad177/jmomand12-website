"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    image: "/img/products/product-1.png",
    title: "Casio G-Shock Premium Edition",
    category: "Electronics",
    bids: 4,
    price: "$189.00",
    oldPrice: "$249.00",
  },
  {
    id: 2,
    image: "/img/products/product-2.png",
    title: "Sony WH-1000XM5 Headphones",
    category: "Electronics",
    bids: 8,
    price: "$299.00",
    oldPrice: "$349.00",
  },
  {
    id: 3,
    image: "/img/products/product-3.png",
    title: "Apple Watch Series 9",
    category: "Wearables",
    bids: 12,
    price: "$399.00",
    oldPrice: "$449.00",
  },
  {
    id: 4,
    image: "/img/products/product-4.png",
    title: "Dell UltraSharp Monitor",
    category: "Office",
    bids: 6,
    price: "$329.00",
    oldPrice: "$389.00",
  },
  {
    id: 5,
    image: "/img/products/product-5.png",
    title: "Kitchen Mixer Pro",
    category: "Kitchen",
    bids: 9,
    price: "$149.00",
    oldPrice: "$199.00",
  },
  {
    id: 6,
    image: "/img/products/product-6.png",
    title: "Gaming Mechanical Keyboard",
    category: "Gaming",
    bids: 14,
    price: "$99.00",
    oldPrice: "$129.00",
  },
  {
    id: 7,
    image: "/img/products/product-7.png",
    title: "Canon EOS Camera",
    category: "Photography",
    bids: 11,
    price: "$899.00",
    oldPrice: "$999.00",
  },
  {
    id: 8,
    image: "/img/products/product-8.png",
    title: "Luxury Office Chair",
    category: "Furniture",
    bids: 7,
    price: "$259.00",
    oldPrice: "$319.00",
  },
  {
    id: 9,
    image: "/img/products/product-9.png",
    title: "Samsung Smart TV",
    category: "Electronics",
    bids: 18,
    price: "$799.00",
    oldPrice: "$949.00",
  },
  {
    id: 10,
    image: "/img/products/product-10.png",
    title: "Coffee Machine Deluxe",
    category: "Appliances",
    bids: 5,
    price: "$179.00",
    oldPrice: "$229.00",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-4xl font-bold text-gray-900 lg:text-5xl">
            Featured Products
          </h2>

          <Link
            href="/products"
            className="inline-flex w-fit items-center rounded border border-orange-500 px-8 py-4 font-semibold text-orange-500 transition hover:bg-orange-500 hover:text-white"
          >
            View All
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.title}
              category={product.category}
              bids={product.bids}
              price={product.price}
              oldPrice={product.oldPrice}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
