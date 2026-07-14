import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <DashboardShell
      title="Loading dashboard"
      description="Fetching account data and preparing your dashboard."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-44 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-2xl" />
    </DashboardShell>
  );
}
