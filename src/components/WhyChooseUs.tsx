"use client";

import {
  BadgeCheck,
  ShieldCheck,
  Warehouse,
  Scale,
  Users,
  Headset,
} from "lucide-react";

const features = [
  {
    title: "Verified Inventory",
    description:
      "Every item is thoroughly inspected and verified by our expert team before it goes live.",
    icon: BadgeCheck,
  },
  {
    title: "Secure Payments",
    description:
      "Enterprise-grade encryption ensures your financial data and transactions are always protected.",
    icon: ShieldCheck,
  },
  {
    title: "Local Pickup",
    description:
      "Save on shipping with convenient local pickup options at our secure warehouse facilities.",
    icon: Warehouse,
  },
  {
    title: "Reserve Price Protection",
    description:
      "Fair bidding experience with transparent reserve prices on high-value premium items.",
    icon: Scale,
  },
  {
    title: "Trusted Sellers",
    description:
      "We only partner with verified retailers and liquidators to ensure product quality.",
    icon: Users,
  },
  {
    title: "Customer Support",
    description:
      "Our dedicated support team is available to assist you with any questions or concerns.",
    icon: Headset,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#0D5FD4] py-20">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white lg:text-5xl">
            Why Choose Us
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-xl text-slate-100">
            The most trusted premium liquidation marketplace for smart buyers.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="rounded-lg border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5">
                  <Icon
                    className="h-10 w-10 text-orange-500"
                    strokeWidth={2.2}
                  />
                </div>

                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="leading-7 text-gray-500">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
