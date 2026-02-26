import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	getCheatMealsByYearGroupedByMonth,
	getGymChecksByYearGroupedByMonth,
} from "@/lib/server-utils";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "./chart-skeleton";

const Chart = dynamic(() => import("./chart").then((mod) => mod.Chart), {
	loading: () => <ChartSkeleton />,
});

const options: {
	[key: string]: {
		title: string;
		description: string;
		fetchCall:
		| typeof getGymChecksByYearGroupedByMonth
		| typeof getCheatMealsByYearGroupedByMonth;
	};
} = {
	workout: {
		title: "Mission Logs (Weekly)",
		description: "XP gain distribution across the week",
		fetchCall: getGymChecksByYearGroupedByMonth,
	},
	"cheat-meal": {
		title: "Damage Logs (Weekly)",
		description: "HP damage distribution across the week",
		fetchCall: getCheatMealsByYearGroupedByMonth,
	},
};

export function WeekdayChart({
	selected,
	year = new Date().getFullYear(),
}: {
	selected: string;
	year?: number;
}) {
	const fetchCallPromise = options[selected].fetchCall({ year });

	return (
		<Card className="col-span-3 min-w-0 max-w-full overflow-hidden rounded-none border-primary/20 bg-[#05050A]/80 shadow-[0_0_15px_rgba(0,240,255,0.05)] hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)] transition-all group relative">
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
			<CardHeader className="relative z-10">
				<CardTitle className="uppercase tracking-widest text-primary font-mono drop-shadow-[0_0_8px_rgba(var(--primary),0.8)] flex items-center gap-3">
					<div className="w-2 h-2 bg-primary rounded-sm shadow-[0_0_5px_rgba(var(--primary),0.8)] animate-pulse" />
					{options[selected].title}
				</CardTitle>
				<CardDescription className="font-mono text-primary/60 tracking-tight">{options[selected].description}</CardDescription>
			</CardHeader>
			<Suspense fallback={<ChartSkeleton />}>
				<Chart selected={selected} fetchCallPromise={fetchCallPromise} />
			</Suspense>
		</Card>
	);
}
