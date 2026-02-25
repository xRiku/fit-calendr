"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useTransition } from "react";
import { Dumbbell, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

function SelectCheckOptionsContent({ selected }: { selected: string }) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [isPending, startTransition] = useTransition();

	const createQueryString = (name: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set(name, value);

		return params.toString();
	};

	const onValueChange = (value: string) => {
		if (value === selected || isPending) return;
		startTransition(() =>
			router.push(`${pathname}?${createQueryString("selected", value)}`),
		);
	};

	return (
		<div
			data-pending={isPending ? "" : undefined}
			className="flex w-full sm:w-[360px] p-1 bg-card rounded-xl border border-border shadow-sm"
			role="tablist"
			aria-label="Select tracker type"
		>
			<button
				type="button"
				role="tab"
				aria-selected={selected === "workout"}
				disabled={isPending}
				onClick={() => onValueChange("workout")}
				className={cn(
					"flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50",
					selected === "workout"
						? "bg-vibrant-green-bg text-vibrant-green shadow-sm"
						: "text-muted-foreground hover:text-foreground",
				)}
			>
				<Dumbbell className="size-4" />
				Workouts
			</button>
			<button
				type="button"
				role="tab"
				aria-selected={selected === "cheat-meal"}
				disabled={isPending}
				onClick={() => onValueChange("cheat-meal")}
				className={cn(
					"flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50",
					selected === "cheat-meal"
						? "bg-vibrant-orange-bg text-vibrant-orange shadow-sm"
						: "text-muted-foreground hover:text-foreground",
				)}
			>
				<Utensils className="size-4" />
				Cheat Meals
			</button>
		</div>
	);
}

export default function SelectCheckOptions({ selected }: { selected: string }) {
	return (
		<Suspense
			fallback={<div className="h-[46px] w-[360px] bg-muted animate-pulse rounded-xl" />}
		>
			<SelectCheckOptionsContent selected={selected} />
		</Suspense>
	);
}
