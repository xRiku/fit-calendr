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
		description: string;
		fetchCall:
			| typeof getGymChecksByYearGroupedByMonth
			| typeof getCheatMealsByYearGroupedByMonth;
	};
} = {
	workout: {
		description: "Frequência de treinos por dia da semana neste ano",
		fetchCall: getGymChecksByYearGroupedByMonth,
	},
	"cheat-meal": {
		description: "Frequência de refeições livres por dia da semana neste ano",
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
		<Card className="col-span-3 min-w-0 max-w-full overflow-hidden">
			<CardHeader>
				<CardTitle>Frequência por Dia da Semana</CardTitle>
				<CardDescription>{options[selected].description}</CardDescription>
			</CardHeader>
			<Suspense fallback={<ChartSkeleton />}>
				<Chart selected={selected} fetchCallPromise={fetchCallPromise} />
			</Suspense>
		</Card>
	);
}
