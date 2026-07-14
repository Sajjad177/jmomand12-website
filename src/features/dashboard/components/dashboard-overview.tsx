"use client";

import Link from "next/link";
import { AlertCircle, CalendarClock, CheckCircle2, CreditCard, Package, UserCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "./dashboard-shell";
import {
  useDashboardAppointments,
  useDashboardInvoices,
  useDashboardProfile,
  useDashboardReadyInvoices,
} from "../hooks/useDashboardData";
import { formatDateTime, formatMoney, formatSlotWindow, getProfileCompletion, mapOrders } from "../utils";

function StatCard({
  label,
  value,
  hint,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "orange" | "green" | "blue" | "slate";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const tones = {
    orange: "border-[#ffb86a] bg-[#fff7ed] text-[#fe6819]",
    green: "border-[#b7efcd] bg-[#effcf4] text-[#00a63e]",
    blue: "border-[#cfe0ff] bg-[#f3f7ff] text-[#003da5]",
    slate: "border-[#dce6f5] bg-white text-[#111827]",
  } as const;

  return (
    <div className={`rounded-2xl border p-5 ${tones[tone]}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#6b7280]">{hint}</p>
    </div>
  );
}

export function DashboardOverview() {
  const profile = useDashboardProfile();
  const invoices = useDashboardInvoices();
  const appointments = useDashboardAppointments();
  const readyInvoices = useDashboardReadyInvoices();

  const isLoading =
    profile.isLoading ||
    invoices.isLoading ||
    appointments.isLoading ||
    readyInvoices.isLoading;

  if (isLoading) {
    return (
      <DashboardShell
        title="Dashboard"
        description="Track invoices, pickup readiness, and the actions that move an order from win to collection."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </DashboardShell>
    );
  }

  if (profile.isError || invoices.isError || appointments.isError || readyInvoices.isError) {
    return (
      <DashboardShell
        title="Dashboard"
        description="Track invoices, pickup readiness, and the actions that move an order from win to collection."
      >
        <div className="rounded-2xl border border-[#fecaca] bg-[#fff7f7] p-6 text-[#991b1b]">
          We couldn&apos;t load your dashboard right now. Please refresh and try again.
        </div>
      </DashboardShell>
    );
  }

  const orders = mapOrders(invoices.data, appointments.data);
  const recentOrders = orders.slice(0, 3);
  const nextAppointment = appointments.data?.find(
    (appointment) => appointment.status === "scheduled",
  );
  const paidInvoices = invoices.data?.filter((invoice) => invoice.status === "paid") ?? [];
  const profileCompletion = getProfileCompletion(profile.data);

  return (
    <DashboardShell
      title="Dashboard"
      description="Track invoices, pickup readiness, and the actions that move an order from win to collection."
      action={
        <Button asChild className="h-11 rounded-xl bg-[#fe6819] px-5 hover:bg-[#e45c12]">
          <Link href="/dashboard/orders">View all orders</Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Paid invoices"
          value={String(paidInvoices.length)}
          hint="Completed auction purchases waiting in your order history."
          tone="orange"
          icon={CreditCard}
        />
        <StatCard
          label="Ready for pickup"
          value={String(readyInvoices.data?.length ?? 0)}
          hint="Orders you can schedule into an available pickup slot."
          tone="green"
          icon={Package}
        />
        <StatCard
          label="Scheduled pickups"
          value={String(
            appointments.data?.filter((appointment) => appointment.status === "scheduled").length ?? 0,
          )}
          hint="Upcoming appointments already reserved with the warehouse."
          tone="blue"
          icon={CalendarClock}
        />
        <StatCard
          label="Profile completion"
          value={`${profileCompletion}%`}
          hint="Complete profile details help invoices and pickup handoff stay smooth."
          tone="slate"
          icon={UserCircle2}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-2xl border border-[#dce6f5] bg-[#f8fbff] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#111827]">Recent order activity</h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                The latest wins, invoice states, and pickup progress across your account.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-xl border-[#dce6f5]">
              <Link href="/dashboard/orders">History</Link>
            </Button>
          </div>

          <div className="mt-5 space-y-4">
            {recentOrders.length ? (
              recentOrders.map((order) => (
                <Link
                  key={order.invoice._id}
                  href={`/dashboard/orders/${order.invoice._id}`}
                  className="block rounded-2xl border border-[#dce6f5] bg-white p-4 transition hover:border-[#ffb86a]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-2xl bg-[#f3f4f6]">
                        {order.invoice.product?.images?.[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={order.invoice.product.images[0].url}
                            alt={order.invoice.product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                          {order.invoice.inventoryId}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-[#111827]">
                          {order.invoice.product?.title ?? "Auction item"}
                        </h3>
                        <p className="mt-1 text-sm text-[#6b7280]">
                          {order.invoice.product?.category ?? "Category unavailable"}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                          Invoice
                        </p>
                        <p className="mt-1 font-semibold text-[#111827]">
                          {order.invoice.invoiceNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                          Amount
                        </p>
                        <p className="mt-1 font-semibold text-[#111827]">
                          {formatMoney(order.invoice.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                          Pickup
                        </p>
                        <p className="mt-1 font-semibold text-[#111827]">
                          {order.pickupStatusLabel}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#dce6f5] bg-white p-8 text-center">
                <p className="text-lg font-semibold text-[#111827]">No order activity yet</p>
                <p className="mt-2 text-sm text-[#6b7280]">
                  As soon as you win and pay for an auction, it will show up here.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[#dce6f5] bg-white p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#00a63e]" />
              <h2 className="text-xl font-semibold text-[#111827]">Next best action</h2>
            </div>
            {readyInvoices.data?.length ? (
              <div className="mt-4 rounded-2xl border border-[#b7efcd] bg-[#effcf4] p-4">
                <p className="text-sm font-semibold text-[#111827]">
                  {readyInvoices.data.length} order
                  {readyInvoices.data.length > 1 ? "s are" : " is"} ready for scheduling
                </p>
                <p className="mt-2 text-sm text-[#4b5563]">
                  Choose a pickup window so the warehouse can prepare your handoff.
                </p>
                <Button asChild className="mt-4 h-10 rounded-xl bg-[#fe6819] hover:bg-[#e45c12]">
                  <Link href="/dashboard/orders">Schedule pickup</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-[#dce6f5] bg-[#f8fbff] p-4">
                <p className="text-sm font-semibold text-[#111827]">Nothing is waiting on you right now</p>
                <p className="mt-2 text-sm text-[#6b7280]">
                  You&apos;re all caught up. We&apos;ll surface the next warehouse step here when it&apos;s available.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#dce6f5] bg-white p-5">
            <div className="flex items-center gap-3">
              <CalendarClock className="h-5 w-5 text-[#003da5]" />
              <h2 className="text-xl font-semibold text-[#111827]">Upcoming pickup</h2>
            </div>
            {nextAppointment ? (
              <div className="mt-4 space-y-3 rounded-2xl border border-[#dce6f5] bg-[#f8fbff] p-4">
                <p className="text-sm font-medium text-[#111827]">{formatSlotWindow(nextAppointment.slot)}</p>
                <p className="text-sm text-[#6b7280]">
                  Appointment created {formatDateTime(nextAppointment.createdAt)}
                </p>
                <p className="text-sm text-[#6b7280]">
                  Pickup code: <span className="font-semibold text-[#111827]">{nextAppointment.pickupCode}</span>
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-[#dce6f5] p-4 text-sm text-[#6b7280]">
                No appointment is booked yet.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#dce6f5] bg-white p-5">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-[#fe6819]" />
              <h2 className="text-xl font-semibold text-[#111827]">Account snapshot</h2>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#6b7280]">Email verification</dt>
                <dd className="font-semibold text-[#111827]">
                  {profile.data?.isVerified ? "Verified" : "Pending"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#6b7280]">Saved payment method</dt>
                <dd className="font-semibold text-[#111827]">
                  {profile.data?.hasDefaultPaymentMethod ? "Available" : "Not added"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#6b7280]">Member since</dt>
                <dd className="font-semibold text-[#111827]">
                  {profile.data?.createdAt ? formatDateTime(profile.data.createdAt) : "Unknown"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
