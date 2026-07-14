"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Loader2, Receipt, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMySalesOrders } from "../api/orders.api";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value?: string) {
  if (!value) return "Unavailable";
  return new Date(value).toLocaleString();
}

export function OrdersHistoryPage() {
  const { status } = useSession();
  const ordersQuery = useQuery({
    queryKey: ["sales-orders", "history"],
    queryFn: getMySalesOrders,
    enabled: status === "authenticated",
  });

  if (status === "loading" || ordersQuery.isLoading) {
    return (
      <section className="container flex min-h-[70vh] items-center justify-center py-16">
        <div className="rounded-3xl border border-[#dce6f5] bg-white p-10 text-center shadow-sm">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#003da5]" />
          <p className="mt-4 text-lg font-semibold text-[#111827]">Loading your orders...</p>
        </div>
      </section>
    );
  }

  if (status === "unauthenticated") {
    return (
      <section className="container flex min-h-[70vh] items-center justify-center py-16">
        <div className="max-w-xl rounded-3xl border border-[#dce6f5] bg-white p-10 text-center shadow-sm">
          <Receipt className="mx-auto h-10 w-10 text-[#003da5]" />
          <h1 className="mt-5 text-3xl font-bold text-[#111827]">Sign in to see your sales orders</h1>
          <Button asChild className="mt-6 rounded-xl bg-[#003da5] hover:bg-[#00358e]">
            <Link href="/login?callbackUrl=%2Forders">Sign in</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (ordersQuery.isError) {
    return (
      <section className="container flex min-h-[70vh] items-center justify-center py-16">
        <div className="max-w-xl rounded-3xl border border-[#fecaca] bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-[#991b1b]">We couldn&apos;t load your orders</h1>
          <p className="mt-3 text-sm text-[#b91c1c]">Please refresh and try again.</p>
        </div>
      </section>
    );
  }

  const orders = ordersQuery.data ?? [];

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#003da5]">Sales Orders</p>
            <h1 className="mt-2 text-4xl font-bold text-[#111827]">Your checkout history</h1>
          </div>
          <Button asChild variant="outline" className="rounded-xl border-[#dce6f5]">
            <Link href="/category">
              <ShoppingBag className="h-4 w-4" />
              Continue shopping
            </Link>
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-[#dce6f5] bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-[#111827]">No sales orders yet</p>
            <p className="mt-2 text-sm text-[#64748b]">
              Once you complete a direct-sale checkout, your order history will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order._id}
                className="rounded-3xl border border-[#dce6f5] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                      Order Number
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-[#111827]">{order.orderNumber}</h2>
                  </div>
                  <span
                    className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] ${
                      order.status === "paid"
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : order.status === "pending"
                          ? "bg-[#eef4ff] text-[#003da5]"
                          : "bg-[#fff1f2] text-[#b91c1c]"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">Total</p>
                    <p className="mt-2 text-lg font-semibold text-[#111827]">{formatMoney(order.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">Created</p>
                    <p className="mt-2 text-sm font-semibold text-[#111827]">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748b]">Paid</p>
                    <p className="mt-2 text-sm font-semibold text-[#111827]">{formatDate(order.paidAt)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
