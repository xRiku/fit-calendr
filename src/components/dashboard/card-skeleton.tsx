import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
	return (
		<>
			<Skeleton className="mt-1 h-7 w-full max-w-36" />
			<Skeleton className="h-4 w-full max-w-52" />
		</>
	);
}
