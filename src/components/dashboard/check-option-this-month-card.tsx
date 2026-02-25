import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	getCheatMealsByYearGroupedByMonth,
	getGymChecksByYearGroupedByMonth,
} from "@/lib/server-utils";
import { Suspense } from "react";
import { CardSkeleton } from "./card-skeleton";

const options: {
	[key: string]: {
		title: string;
		fetchCall:
		| typeof getGymChecksByYearGroupedByMonth
		| typeof getCheatMealsByYearGroupedByMonth;
	};
} = {
	workout: {
		title: "Workouts (month)",
		fetchCall: getGymChecksByYearGroupedByMonth,
	},
	"cheat-meal": {
		title: "Cheat meals (month)",
		fetchCall: getCheatMealsByYearGroupedByMonth,
	},
};

async function CardData({
	selected,
	year,
}: { selected: keyof typeof options; year: number }) {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();
	const gymChecksGroupedByMonth = await options[selected].fetchCall({ year });

	const getDiffFromLastMonth = async () => {
		// For non-current years, show the last month of that year
		const targetMonth = year === currentYear ? currentMonth : 11;
		const thisMonth =
			gymChecksGroupedByMonth.hashTable[targetMonth]?.length || 0;
		if (thisMonth === 0) {
			return 0;
		}
		let prevMonth =
			gymChecksGroupedByMonth.hashTable[targetMonth - 1]?.length || 0;

		if (prevMonth === 0) {
			if (targetMonth === 0) {
				const prevYearGymChecksGroupedByMonth = await options[
					selected
				].fetchCall({
					year: year - 1,
				});
				prevMonth =
					prevYearGymChecksGroupedByMonth.hashTable[11]?.length || 0;
				if (prevMonth === 0) {
					return 0;
				}
				return (thisMonth / prevMonth - 1) * 100;
			}

			return 0;
		}

		return (thisMonth / prevMonth - 1) * 100;
	};

	const diffFromLastMonth = await getDiffFromLastMonth();
	const currentYearVal = new Date().getFullYear();
	const targetMonth = year === currentYearVal ? new Date().getMonth() : 11;
	const isPositive = diffFromLastMonth > 0;
	const isGoodTrend = selected === "cheat-meal" ? !isPositive : isPositive;

	return (
		<>
			{gymChecksGroupedByMonth && (
				<>
					<span className="text-2xl font-bold">
						{gymChecksGroupedByMonth.hashTable[targetMonth]?.length || 0}
					</span>
					{diffFromLastMonth !== 0 && (
						<p className="text-xs text-muted-foreground">
							{isPositive ? "Up by " : "Down by "}
							<span
								className={isGoodTrend ? "text-emerald-500" : "text-red-500"}
							>
								{diffFromLastMonth > 0
									? `+${diffFromLastMonth.toFixed(1)}`
									: diffFromLastMonth.toFixed(1)}
								%
							</span>{" "}
							vs last month
						</p>
					)}
				</>
			)}
		</>
	);
}

export default function CheckOptionThisMonthCard({
	selected,
	year = new Date().getFullYear(),
}: {
	selected: keyof typeof options;
	year?: number;
}) {

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-base font-semibold">
					{options[selected]?.title}
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
