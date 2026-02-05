import { Skeleton } from "@/components/ui/skeleton";

export function HeatmapSkeleton() {
	return (
		<div className="flex flex-col px-6 gap-5 pt-0">
			<Skeleton className="h-32 w-full" />
		</div>
	);
}
