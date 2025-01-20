import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarSkeleton() {
  return (
    <div className="rdp py-6 mr-4">
      <div className="flex flex-col items-center justify-center w-64 ">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="mt-4 w-full h-56" />
      </div>
    </div>
  );
}
