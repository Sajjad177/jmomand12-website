import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "full";
}

export function Skeleton({
  className,
  rounded = "md",
  ...props
}: SkeletonProps) {
  const roundedClass = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-muted via-muted/60 to-muted bg-[length:200%_100%]",
        "animate-[shimmer_1.8s_infinite]",
        roundedClass[rounded],
        className,
      )}
      {...props}
    />
  );
}
