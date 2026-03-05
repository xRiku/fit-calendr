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
		title: "Frequência de Treinos",
		description: "Mostrando a frequência de treinos neste ano",
		fetchCall: getGymChecksByYearGroupedByMonth,
	},
	"cheat-meal": {
		title: "Frequência de Refeições Livres",
		description: "Mostrando a frequência de refeições livres neste ano",
		fetchCall: getCheatMealsByYearGroupedByMonth,
	},
};

export function FrequencyChart({
	selected,
	year = new Date().getFullYear(),
}: {
	selected: string;
	year?: number;
}) {
	const fetchCallPromise = options[selected].fetchCall({ year });

	return (
		<Card className="col-span-6 min-w-0 max-w-full overflow-hidden">
			<CardHeader>
				<CardTitle>{options[selected].title}</CardTitle>
				<CardDescription>{options[selected].description}</CardDescription>
			</CardHeader>
			<Suspense fallback={<ChartSkeleton />}>
				<Chart selected={selected} fetchCallPromise={fetchCallPromise} />
			</Suspense>
		</Card>
	);
}
