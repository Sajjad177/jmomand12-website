"use client";

import { UserPlus, Gavel, Trophy, CreditCard } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Register Account",
    description:
      "Create your free account and verify your email to start bidding instantly.",
    icon: UserPlus,
  },
  {
    id: 2,
    title: "Place Bid",
    description:
      "Browse thousands of lots and place your max bid or bid incrementally.",
    icon: Gavel,
  },
  {
    id: 3,
    title: "Win Auction",
    description:
      "If you're the highest bidder when the clock hits zero, you've won the item!",
    icon: Trophy,
  },
  {
    id: 4,
    title: "Pay & Pickup",
    description:
      "Complete your payment securely and schedule your local pickup time.",
    icon: CreditCard,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#0B63CE] py-20">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-white lg:text-5xl">
            How It Works
          </h2>

          <p className="mt-4 text-xl text-slate-100">
            Join thousands of smart buyers winning premium products in four
            simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                  <Icon className="h-8 w-8 text-orange-500" strokeWidth={2.5} />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-2xl font-bold text-white">
                  {step.id}. {step.title}
                </h3>

                {/* Description */}
                <p className="max-w-xs text-base leading-7 text-slate-100">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
