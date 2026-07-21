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
    <section id="howitwork" className="bg-[#0D5FD4] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange-400">
            Built For Trust
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Why Choose Us
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-blue-100 sm:text-lg">
            The most trusted premium liquidation marketplace for smart buyers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group flex h-full flex-col justify-between rounded-2xl border border-[#2573E8] bg-white p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50"
              >
                <div>
                  {/* Icon Frame */}
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 transition-colors duration-300 group-hover:bg-orange-500">
                    <Icon
                      className="h-7 w-7 text-orange-500 transition-colors duration-300 group-hover:text-white"
                      strokeWidth={2}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base leading-relaxed text-slate-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
