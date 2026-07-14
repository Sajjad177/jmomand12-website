"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, CalendarClock, MapPinned, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardShell } from "./dashboard-shell";
import { useDashboardAppointments, useDashboardInvoices } from "../hooks/useDashboardData";
import {
  formatDateTime,
  formatMoney,
  formatSlotWindow,
  mapOrders,
} from "../utils";

export function DashboardOrderDetailPage({ invoiceId }: { invoiceId: string }) {
  const invoices = useDashboardInvoices();
  const appointments = useDashboardAppointments();

  const order = useMemo(() => {
    const orders = mapOrders(invoices.data, appointments.data);
    return orders.find((item) => item.invoice._id === invoiceId);
  }, [appointments.data, invoiceId, invoices.data]);

  if (invoices.isLoading || appointments.isLoading) {
    return (
      <DashboardShell
        title="Order details"
        description="Review invoice status, pickup readiness, and the exact handoff timeline for this order."
      >
        <Skeleton className="h-80 rounded-2xl" />
      </DashboardShell>
    );
  }

  if (invoices.isError || appointments.isError) {
    return (
      <DashboardShell
        title="Order details"
        description="Review invoice status, pickup readiness, and the exact handoff timeline for this order."
      >
        <div className="rounded-2xl border border-[#fecaca] bg-[#fff7f7] p-6 text-[#991b1b]">
          We couldn&apos;t load this order right now.
        </div>
      </DashboardShell>
    );
  }

  if (!order) {
    return (
      <DashboardShell
        title="Order not found"
        description="This invoice could not be found in your current order history."
      >
        <div className="rounded-2xl border border-dashed border-[#dce6f5] bg-white p-10 text-center">
          <p className="text-xl font-semibold text-[#111827]">Nothing matched this order link</p>
          <p className="mt-2 text-sm text-[#6b7280]">
            The invoice may not belong to this account, or it may no longer be available from the current API response.
          </p>
          <Button asChild className="mt-6 rounded-xl bg-[#fe6819] hover:bg-[#e45c12]">
            <Link href="/dashboard/invoices">Back to invoices</Link>
          </Button>
        </div>
      </DashboardShell>
    );
  }

  const product = order.invoice.product;
  const steps = [
    {
      title: "Invoice created",
      description: `Order recorded as ${order.invoice.invoiceNumber}.`,
      completed: true,
      timestamp: order.invoice.createdAt,
    },
    {
      title: "Payment captured",
      description:
        order.invoice.status === "paid"
          ? "Payment completed successfully."
          : "Payment has not completed yet.",
      completed: order.invoice.status === "paid",
      timestamp: order.invoice.paidAt,
    },
    {
      title: "Pickup scheduled",
      description: order.appointment
        ? `Slot reserved for ${formatSlotWindow(order.appointment.slot)}.`
        : "Pickup has not been scheduled yet.",
      completed: Boolean(order.appointment),
      timestamp: order.appointment?.createdAt,
    },
    {
      title: "Picked up",
      description:
        order.appointment?.status === "completed"
          ? "Warehouse handoff completed."
          : "Awaiting final pickup completion.",
      completed: order.appointment?.status === "completed",
      timestamp: order.appointment?.completedAt,
    },
  ];

  return (
    <DashboardShell
      title="Order details"
      description="Review invoice status, pickup readiness, and the exact handoff timeline for this order."
      action={
        <Button asChild variant="outline" className="rounded-xl border-[#dce6f5]">
          <Link href="/dashboard/invoices">
            <ArrowLeft className="h-4 w-4" />
            Back to invoices
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-[#dce6f5] bg-white p-6">
          <div className="flex flex-col gap-6 xl:flex-row">
            <div className="h-64 overflow-hidden rounded-2xl bg-[#f3f4f6] xl:w-80">
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
                <span className="rounded-md bg-[#eef4ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#003da5]">
                  {order.invoice.inventoryId}
                </span>
                <span className="rounded-md bg-[#ecfdf5] px-3 py-1 text-xs font-semibold text-[#15803d]">
                  {order.invoice.status.replaceAll("_", " ").toUpperCase()}
                </span>
              </div>
              <h2 className="mt-4 text-3xl font-bold text-[#111827]">
                {product?.title ?? "Auction item"}
              </h2>
              <p className="mt-2 text-base text-[#6b7280]">
                {product?.description ?? "Description unavailable."}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-[#f8fbff] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                    Invoice
                  </p>
                  <p className="mt-2 text-lg font-bold text-[#111827]">
                    {order.invoice.invoiceNumber}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f8fbff] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                    Amount
                  </p>
                  <p className="mt-2 text-lg font-bold text-[#111827]">
                    {formatMoney(order.invoice.amount)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f8fbff] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                    Pickup status
                  </p>
                  <p className="mt-2 text-lg font-bold text-[#111827]">
                    {order.pickupStatusLabel}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f8fbff] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                    Pickup code
                  </p>
                  <p className="mt-2 text-lg font-bold text-[#111827]">
                    {order.invoice.pickupCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-[#dce6f5] bg-white p-6">
            <div className="flex items-center gap-3">
              <PackageOpen className="h-5 w-5 text-[#fe6819]" />
              <h3 className="text-2xl font-semibold text-[#111827]">Fulfilment timeline</h3>
            </div>
            <div className="mt-6 space-y-5">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-4 w-4 rounded-full ${
                        step.completed ? "bg-[#fe6819]" : "bg-[#dce6f5]"
                      }`}
                    />
                    {index < steps.length - 1 ? (
                      <div className="mt-2 h-full w-px bg-[#dce6f5]" />
                    ) : null}
                  </div>
                  <div className="pb-6">
                    <p className="text-lg font-semibold text-[#111827]">{step.title}</p>
                    <p className="mt-1 text-sm text-[#6b7280]">{step.description}</p>
                    <p className="mt-2 text-sm font-medium text-[#111827]">
                      {step.timestamp ? formatDateTime(step.timestamp) : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-[#dce6f5] bg-white p-6">
              <div className="flex items-center gap-3">
                <CalendarClock className="h-5 w-5 text-[#003da5]" />
                <h3 className="text-2xl font-semibold text-[#111827]">Pickup appointment</h3>
              </div>
              <div className="mt-5 rounded-2xl bg-[#f8fbff] p-5">
                <p className="text-sm text-[#6b7280]">Slot window</p>
                <p className="mt-2 text-lg font-semibold text-[#111827]">
                  {formatSlotWindow(order.appointment?.slot)}
                </p>
                <p className="mt-4 text-sm text-[#6b7280]">
                  Appointment status:{" "}
                  <span className="font-semibold text-[#111827]">
                    {order.appointment?.status ?? "Not scheduled"}
                  </span>
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-[#dce6f5] bg-white p-6">
              <div className="flex items-center gap-3">
                <MapPinned className="h-5 w-5 text-[#00a63e]" />
                <h3 className="text-2xl font-semibold text-[#111827]">Verification details</h3>
              </div>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#6b7280]">Pickup code</dt>
                  <dd className="font-semibold text-[#111827]">{order.invoice.pickupCode}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#6b7280]">QR available</dt>
                  <dd className="font-semibold text-[#111827]">
                    {order.invoice.pickupQrDataUrl ? "Yes" : "No"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#6b7280]">Invoice created</dt>
                  <dd className="font-semibold text-[#111827]">
                    {formatDateTime(order.invoice.createdAt)}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
