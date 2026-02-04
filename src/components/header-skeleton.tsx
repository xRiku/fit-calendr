import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
	return (
		<header className="h-14 sm:mb-0 backdrop-blur-md border-b border-neutral-800 bg-neutral-900/80 sticky top-0 z-50">
			<div className="px-4 xl:px-6 h-full max-w-7xl mx-auto flex justify-between items-center">
				<Skeleton className="h-8 w-24" />
				<Skeleton className="h-10 w-10 rounded-full" />
			</div>
		</header>
	);
}
