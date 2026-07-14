"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, CreditCard, Package, Heart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: Package },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/orders", label: "Orders", icon: CreditCard },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
];

export function DashboardShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="container py-6 md:py-10">
        <div className="rounded-[20px] border border-[#dce6f5] bg-white p-5 shadow-sm md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#fe6819]">
                  Customer dashboard
                </p>
                <h1 className="text-3xl font-bold text-[#111827] md:text-4xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-[#6b7280] md:text-base">
                  {description}
                </p>
              </div>
              {action ? <div className="shrink-0">{action}</div> : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {links.map(({ href, icon: Icon, label }) => {
                const active = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group rounded-2xl border p-4 transition",
                      active
                        ? "border-[#ffb86a] bg-[#fff7ed]"
                        : "border-[#dce6f5] bg-[#f8fbff] hover:border-[#ffb86a] hover:bg-white",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-2xl",
                          active ? "bg-[#ffedd4] text-[#fe6819]" : "bg-white text-[#003da5]",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#94a3b8] transition group-hover:translate-x-1" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-[#111827]">
                      {label}
                    </p>
                  </Link>
                );
              })}
            </div>

            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
