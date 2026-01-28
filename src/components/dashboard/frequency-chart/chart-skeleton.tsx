import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
	return (
		<div className="flex flex-col px-6 gap-5 pt-0">
			<Skeleton className="h-72 w-full" />
			<Skeleton className="h-4 w-52 mb-5" />
		</div>
	);
}
