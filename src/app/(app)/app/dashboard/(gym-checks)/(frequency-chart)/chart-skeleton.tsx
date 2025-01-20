import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
  return (
    <div className="flex flex-col px-6 gap-6 pt-0">
      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-4 w-52 mb-6" />
    </div>
  );
}
