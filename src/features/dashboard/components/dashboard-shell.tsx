"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, House } from "lucide-react";

const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  profile: "Profile Settings",
  wishlist: "Wishlist",
  invoices: "Invoices",
  orders: "Invoices",
};

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ href: "/", label: "Home", isCurrent: false }];

  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    let label = segmentLabels[segment] ?? segment;
    const isLast = index === segments.length - 1;

    if (segments[index - 1] === "invoices" && isLast) {
      label = "Invoice Details";
    }

    if (segments[index - 1] === "orders" && isLast) {
      label = "Invoice Details";
    }

    breadcrumbs.push({
      href: currentPath,
      label,
      isCurrent: isLast,
    });
  });

  return breadcrumbs;
}

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
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <section className="mx-auto w-full max-w-[1280px] px-4 py-6 md:px-6 md:py-10">
        <div className="space-y-6">
          <nav aria-label="Breadcrumb" className="overflow-x-auto">
            <ol className="flex min-w-max items-center gap-2 text-sm text-[#737373]">
              {breadcrumbs.map((item, index) => (
                <li key={item.href} className="flex items-center gap-2">
                  {index === 0 ? <House className="h-4 w-4 shrink-0" /> : null}
                  {item.isCurrent ? (
                    <span className="font-medium text-[#171717]">{item.label}</span>
                  ) : (
                    <Link
                      href={item.href}
                      className="transition hover:text-[#ff6900] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6900]"
                    >
                      {item.label}
                    </Link>
                  )}
                  {!item.isCurrent ? <ChevronRight className="h-4 w-4 shrink-0" /> : null}
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#171717] md:text-4xl">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-[#737373] md:text-base">
                {description}
              </p>
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>

          {children}
        </div>
      </section>
    </main>
  );
}
