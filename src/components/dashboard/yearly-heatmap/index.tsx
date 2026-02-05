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
		title: "Workout Heatmap",
		description: "Daily workout activity for the year",
		fetchCall: getGymChecksByYearGroupedByMonth,
	},
	"cheat-meal": {
		title: "Cheat Meal Heatmap",
		description: "Daily cheat meal activity for the year",
		fetchCall: getCheatMealsByYearGroupedByMonth,
	},
};

export function YearlyHeatmap({
	selected,
	year = new Date().getFullYear(),
}: {
	selected: string;
	year?: number;
}) {
	const fetchCallPromise = options[selected].fetchCall({ year });

	async function HeatmapData() {
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

	return (
		<Card>
			<CardHeader>
				<CardTitle>{options[selected].title}</CardTitle>
				<CardDescription>{options[selected].description}</CardDescription>
			</CardHeader>
			<div className="px-6 pb-6">
				<Suspense fallback={<HeatmapSkeleton />}>
					<HeatmapData />
				</Suspense>
			</div>
		</Card>
	);
}
