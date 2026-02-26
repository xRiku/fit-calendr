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
		title: "XP GAINED (YEAR)",
		fetchCall: getGymChecksByYearGroupedByMonth,
	},
	"cheat-meal": {
		title: "HP DAMAGE (YEAR)",
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
					<span className="text-3xl font-bold font-mono tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
						{gymChecksGroupedByMonth.count || 0}
					</span>
					{diffFromLastYear !== 0 && (
						<p className="text-[10px] font-mono mt-1 text-white/50 tracking-widest uppercase">
							{isPositive ? "↑ " : "↓ "}
							<span
								className={isGoodTrend ? "text-vibrant-green drop-shadow-[0_0_5px_rgba(var(--vibrant-green),0.8)]" : "text-destructive drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]"}
							>
								{diffFromLastYear > 0
									? `+${diffFromLastYear.toFixed(1)}`
									: diffFromLastYear.toFixed(1)}
								%
							</span>{" "}
							VS PREV YEAR
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
		<Card className="rounded-none border border-primary/20 bg-[#05050A]/80 shadow-[0_0_15px_rgba(0,240,255,0.02)] transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)] group relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
				<CardTitle className="text-sm font-mono tracking-widest text-primary flex items-center gap-2">
					<div className="w-2 h-2 rounded-sm bg-primary shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
					{options[selected].title}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-1 relative z-10 pt-2">
				<Suspense fallback={<CardSkeleton />}>
					<CardData selected={selected} year={year} />
				</Suspense>
			</CardContent>
		</Card>
	);
}
