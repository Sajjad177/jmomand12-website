"use client";

import Link from "next/link";
import { AlertCircle, ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CheckoutCancelPage() {
  return (
    <section className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="max-w-2xl rounded-3xl border border-[#dce6f5] bg-white p-10 text-center shadow-sm">
        <div className="mx-auto w-fit rounded-full bg-[#fff7ed] p-4 text-[#ea580c]">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-[#111827]">Checkout cancelled</h1>
        <p className="mt-3 text-sm leading-6 text-[#64748b]">
          Your Stripe checkout was cancelled before payment completed. Your cart has not been cleared,
          so you can review your items and try again whenever you’re ready.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-xl bg-[#003da5] hover:bg-[#00358e]">
            <Link href="/cart">
              <ShoppingCart className="h-4 w-4" />
              Return to cart
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-[#dce6f5]">
            <Link href="/category">
              <ShoppingBag className="h-4 w-4" />
              Continue shopping
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
