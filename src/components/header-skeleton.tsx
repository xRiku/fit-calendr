import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
	return (
		<div className="flex items-center justify-between px-4 h-14">
			{/* Logo/Brand area skeleton */}
			<Skeleton className="h-8 w-24" />
			{/* Avatar skeleton */}
			<Skeleton className="h-10 w-10 rounded-full" />
		</div>
	);
}
