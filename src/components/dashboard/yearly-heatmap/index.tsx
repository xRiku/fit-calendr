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
		title: "Mapa de Calor de Treinos",
		description: "Atividade diária de treinos no ano",
		fetchCall: getGymChecksByYearGroupedByMonth,
	},
	"cheat-meal": {
		title: "Mapa de Calor das Refeições",
		description: "Refeições livres diárias no ano",
		fetchCall: getCheatMealsByYearGroupedByMonth,
	},
};

async function HeatmapData({
	fetchCallPromise,
	year,
	selected,
}: {
	fetchCallPromise:
	| ReturnType<typeof getGymChecksByYearGroupedByMonth>
	| ReturnType<typeof getCheatMealsByYearGroupedByMonth>;
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
		<Card className="hover:bg-white/5 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group border-white/5 md:col-span-full">
			<CardHeader>
				<CardTitle>{options[selected].title}</CardTitle>
				<CardDescription>{options[selected].description}</CardDescription>
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
