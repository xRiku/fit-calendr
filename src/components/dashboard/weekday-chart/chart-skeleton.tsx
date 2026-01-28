import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
	return (
		<div className="flex flex-col px-6 items-center gap-6 pt-0">
			<Skeleton className="h-56 w-56 rounded-full" />
			<div className="flex items-center justify-evenly w-full px-10">
				<Skeleton className="h-4 w-12" />
				<Skeleton className="h-4 w-12" />
				<Skeleton className="h-4 w-12" />
			</div>
			<Skeleton className="h-4 w-52 mb-6" />
		</div>
	);
}
