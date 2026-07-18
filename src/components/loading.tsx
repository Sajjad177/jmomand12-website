import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-background p-4">
      <Skeleton className="aspect-square w-full rounded-lg" />

      <div className="mt-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />

        <Skeleton className="h-4 w-full" />

        <Skeleton className="h-4 w-5/6" />

        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />

          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function AvatarSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-4">
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
          <Skeleton className="h-5" />
        </div>
      ))}
    </div>
  );
}

export function CategorySkeleton({ items = 6 }: { items?: number }) {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="space-y-4">
            <Skeleton className="h-10 w-48 rounded-full" />
            <Skeleton className="h-5 w-72 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>

        <div className="no-scrollbar flex gap-8 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory">
          {Array.from({ length: items }).map((_, index) => (
            <div
              key={index}
              className="block min-w-40 max-w-40 snap-start text-center"
            >
              <div className="mx-auto h-40 w-40 rounded-full border-[6px] border-[#153B7A] bg-slate-100 transition duration-300 animate-pulse" />
              <Skeleton className="mt-5 h-6 w-32 rounded-full mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const Loading = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default Loading;
