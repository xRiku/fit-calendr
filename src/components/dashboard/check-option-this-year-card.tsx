import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSkeleton } from "./card-skeleton";

import {
	getCheatMealsByYearGroupedByMonth,
	getGymChecksByYearGroupedByMonth,
} from "@/lib/server-utils";
import { Suspense } from "react";

const options: {
	[key: string]: {
		title: string;
		fetchCall:
		| typeof getGymChecksByYearGroupedByMonth
		| typeof getCheatMealsByYearGroupedByMonth;
	};
} = {
	workout: {
		title: "Workouts (year)",
		fetchCall: getGymChecksByYearGroupedByMonth,
	},
	"cheat-meal": {
		title: "Cheat meals (year)",
		fetchCall: getCheatMealsByYearGroupedByMonth,
	},
};

async function CardData({ selected, year }: { selected: string; year: number }) {
	const gymChecksGroupedByMonth = await options[selected].fetchCall({ year });

	const getDiffFromLastYear = async () => {
		const thisYear = gymChecksGroupedByMonth.count || 0;
		if (thisYear === 0) {
			return 0;
		}

		const lastYearGymChecksGroupedByMonth = await options[selected].fetchCall(
			{
				year: year - 1,
			},
		);
		const prevYear = lastYearGymChecksGroupedByMonth?.count || 0;

		if (prevYear === 0) {
			return 0;
		}

		return (thisYear / prevYear - 1) * 100;
	};

	const diffFromLastYear = await getDiffFromLastYear();
	const isPositive = diffFromLastYear > 0;
	const isGoodTrend = selected === "cheat-meal" ? !isPositive : isPositive;

	return (
		<>
			{gymChecksGroupedByMonth ? (
				<>
					<span className="text-2xl font-bold">
						{gymChecksGroupedByMonth.count || 0}
					</span>
					{diffFromLastYear !== 0 && (
						<p className="text-xs text-muted-foreground">
							{isPositive ? "Up by " : "Down by "}
							<span
								className={isGoodTrend ? "text-emerald-500" : "text-red-500"}
							>
								{diffFromLastYear > 0
									? `+${diffFromLastYear.toFixed(1)}`
									: diffFromLastYear.toFixed(1)}
								%
							</span>{" "}
							vs last year
						</p>
					)}
				</>
			) : (
				<></>
			)}
		</>
	);
}

export default async function CheckOptionThisYearCard({
	selected,
	year = new Date().getFullYear(),
}: {
	selected: string;
	year?: number;
}) {

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-base font-semibold">
					{options[selected].title}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-1">
				<Suspense fallback={<CardSkeleton />}>
					<CardData selected={selected} year={year} />
				</Suspense>
			</CardContent>
		</Card>
	);
}
