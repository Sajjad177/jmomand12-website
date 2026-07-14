"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarRange, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardShell } from "./dashboard-shell";
import {
  useDashboardAppointments,
  useDashboardInvoices,
  useDashboardReadyInvoices,
  usePickupSlots,
  useSchedulePickup,
} from "../hooks/useDashboardData";
import { formatDateTime, formatMoney, formatSlotWindow, mapOrders } from "../utils";

const PAGE_SIZE = 6;

type FilterKey = "all" | "ready" | "scheduled" | "completed";

export function DashboardOrdersPage() {
  const invoices = useDashboardInvoices();
  const appointments = useDashboardAppointments();
  const readyInvoices = useDashboardReadyInvoices();
  const [page, setPage] = useState(1);
  const [schedulingOrderId, setSchedulingOrderId] = useState<string | null>(null);
  const pickupSlots = usePickupSlots(Boolean(schedulingOrderId));
  const schedulePickup = useSchedulePickup();

  const orders = useMemo(
    () => mapOrders(invoices.data, appointments.data),
    [appointments.data, invoices.data],
  );

  const [filter, setFilter] = useState<FilterKey>("all");

  const filteredOrders = useMemo(() => {
    switch (filter) {
      case "ready":
        return orders.filter((order) => order.pickupActionable);
      case "scheduled":
        return orders.filter((order) => order.appointment?.status === "scheduled");
      case "completed":
        return orders.filter((order) => order.appointment?.status === "completed");
      default:
        return orders;
    }
  }, [filter, orders]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleSchedulePickup(invoiceId: string) {
    const slot = pickupSlots.data?.[0];
    if (!slot) {
      toast.error("No pickup slots are available right now.");
      return;
    }

    try {
      await schedulePickup.mutateAsync({
        slotId: slot._id,
        invoiceIds: [invoiceId],
      });
      toast.success("Pickup scheduled successfully.");
      setSchedulingOrderId(null);
    } catch {
      toast.error("We couldn't schedule pickup for this order.");
    }
  }

  const isLoading = invoices.isLoading || appointments.isLoading || readyInvoices.isLoading;
  const isError = invoices.isError || appointments.isError || readyInvoices.isError;

  return (
    <DashboardShell
      title="Orders & invoices"
      description="Review wins, payment state, and pickup progress across the full post-auction journey."
      action={
        <div className="rounded-2xl border border-[#dce6f5] bg-[#f8fbff] px-4 py-3 text-sm text-[#6b7280]">
          Ready to schedule: <span className="font-semibold text-[#111827]">{readyInvoices.data?.length ?? 0}</span>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 border-b border-[#dce6f5] pb-4">
          {[
            ["all", "All"],
            ["ready", "Ready for pickup"],
            ["scheduled", "Scheduled"],
            ["completed", "Completed"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setFilter(key as FilterKey);
                setPage(1);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === key
                  ? "bg-[#fe6819] text-white"
                  : "bg-[#f5f5f5] text-[#525252] hover:bg-[#fff1e7]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-[#fecaca] bg-[#fff7f7] p-6 text-[#991b1b]">
            We couldn&apos;t load your orders right now.
          </div>
        ) : paginatedOrders.length ? (
          <div className="space-y-4">
            {paginatedOrders.map((order) => {
              const product = order.invoice.product;
              const isScheduling = schedulePickup.isPending && schedulingOrderId === order.invoice._id;

              return (
                <article
                  key={order.invoice._id}
                  className="rounded-2xl border border-[#dce6f5] bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                    <div className="flex flex-1 items-start gap-4">
                      <div className="h-28 w-28 overflow-hidden rounded-2xl bg-[#f3f4f6]">
                        {product?.images?.[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-bold text-[#111827]">
                            {product?.title ?? "Auction item"}
                          </h2>
                          <span
                            className={`rounded-md px-3 py-1 text-xs font-semibold ${
                              order.invoice.status === "paid"
                                ? "bg-[#dcfce7] text-[#15803d]"
                                : "bg-[#fff1f2] text-[#b91c1c]"
                            }`}
                          >
                            {order.invoice.status.replaceAll("_", " ").toUpperCase()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#6b7280]">
                          {product?.category ?? "Category unavailable"}
                        </p>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                              Invoice
                            </p>
                            <p className="mt-1 text-lg font-bold text-[#111827]">
                              {order.invoice.invoiceNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                              Amount
                            </p>
                            <p className="mt-1 text-lg font-bold text-[#111827]">
                              {formatMoney(order.invoice.amount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                              Order date
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#111827]">
                              {formatDateTime(order.invoice.paidAt ?? order.invoice.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                              Pickup status
                            </p>
                            <p className="mt-1 text-sm font-semibold text-[#111827]">
                              {order.pickupStatusLabel}
                            </p>
                          </div>
                        </div>

                        {order.appointment?.slot ? (
                          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#f8fbff] px-4 py-3 text-sm text-[#4b5563]">
                            <CalendarRange className="h-4 w-4 text-[#003da5]" />
                            {formatSlotWindow(order.appointment.slot)}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-3 xl:w-[220px]">
                      <Button
                        asChild
                        variant="outline"
                        className="h-12 rounded-xl border-[#fe6819] text-[#fe6819] hover:bg-[#fff3eb] hover:text-[#fe6819]"
                      >
                        <Link href={`/dashboard/orders/${order.invoice._id}`}>
                          {order.invoice.status === "paid" ? "View invoice" : "View details"}
                        </Link>
                      </Button>

                      {order.pickupActionable ? (
                        <Button
                          type="button"
                          onClick={() => {
                            setSchedulingOrderId(order.invoice._id);
                            void handleSchedulePickup(order.invoice._id);
                          }}
                          className="h-12 rounded-xl bg-[#fe6819] hover:bg-[#e45c12]"
                          disabled={isScheduling}
                        >
                          {isScheduling ? "Scheduling..." : "Schedule pickup"}
                        </Button>
                      ) : (
                        <div className="rounded-xl border border-[#dce6f5] px-4 py-3 text-sm text-[#6b7280]">
                          {order.appointment?.status === "scheduled"
                            ? "Pickup reserved"
                            : order.appointment?.status === "completed"
                              ? "Pickup completed"
                              : "No action needed"}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            <div className="flex flex-col gap-4 border-t border-[#dce6f5] pt-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-[#6b7280]">
                Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(page * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-[#dce6f5]"
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="rounded-xl bg-[#fe6819] px-4 py-2 text-sm font-semibold text-white">
                  {page}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-[#dce6f5]"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#dce6f5] bg-white p-10 text-center">
            <PackageSearch className="mx-auto h-10 w-10 text-[#94a3b8]" />
            <p className="mt-4 text-xl font-semibold text-[#111827]">No matching orders</p>
            <p className="mt-2 text-sm text-[#6b7280]">
              Once invoices are created for your account, they&apos;ll appear here with pickup actions.
            </p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
