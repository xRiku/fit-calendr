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
import { buildHeatmapData } from "@/lib/heatmap-utils";
import { Suspense } from "react";
import { HeatmapGrid } from "./heatmap-grid";
import { HeatmapSkeleton } from "./heatmap-skeleton";

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
		title: "Yearly XP Contribution",
		description: "Daily XP activity logged for the given year",
		fetchCall: getGymChecksByYearGroupedByMonth,
	},
	"cheat-meal": {
		title: "Yearly HP Damage",
		description: "Daily HP damage logged for the given year",
		fetchCall: getCheatMealsByYearGroupedByMonth,
	},
};

async function HeatmapData({
	fetchCallPromise,
	year,
	selected,
}: {
	fetchCallPromise: ReturnType<typeof getGymChecksByYearGroupedByMonth> | ReturnType<typeof getCheatMealsByYearGroupedByMonth>;
	year: number;
	selected: string;
}) {
	const grouped = await fetchCallPromise;
	const data = buildHeatmapData(grouped.hashTable);

	return (
		<HeatmapGrid
			data={data}
			year={year}
			selected={selected as "workout" | "cheat-meal"}
		/>
	);
}

export function YearlyHeatmap({
	selected,
	year = new Date().getFullYear(),
}: {
	selected: string;
	year?: number;
}) {
	const fetchCallPromise = options[selected].fetchCall({ year });

	return (
		<Card className="rounded-none border-primary/20 bg-[#05050A]/80 shadow-[0_0_15px_rgba(0,240,255,0.05)] hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)] transition-all duration-300 overflow-hidden group relative">
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
			<CardHeader className="pb-4 relative z-10">
				<CardTitle className="text-xl tracking-widest uppercase font-mono text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)] flex items-center gap-3">
					<div className="w-2 h-2 bg-primary rounded-sm shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
					{options[selected].title}
				</CardTitle>
				<CardDescription className="text-primary/60 font-mono tracking-tight">{options[selected].description}</CardDescription>
			</CardHeader>
			<div className="px-6 pb-6">
				<Suspense fallback={<HeatmapSkeleton />}>
					<HeatmapData
						fetchCallPromise={fetchCallPromise}
						year={year}
						selected={selected}
					/>
				</Suspense>
			</div>
		</Card>
	);
}
