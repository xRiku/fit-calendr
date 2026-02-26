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
		title: "XP GAINED (MONTH)",
		fetchCall: getGymChecksByYearGroupedByMonth,
	},
	"cheat-meal": {
		title: "HP DAMAGE (MONTH)",
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
					<span className="text-3xl font-bold font-mono tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
						{gymChecksGroupedByMonth.hashTable[targetMonth]?.length || 0}
					</span>
					{diffFromLastMonth !== 0 && (
						<p className="text-[10px] font-mono mt-1 text-white/50 tracking-widest uppercase">
							{isPositive ? "↑ " : "↓ "}
							<span
								className={isGoodTrend ? "text-vibrant-green drop-shadow-[0_0_5px_rgba(var(--vibrant-green),0.8)]" : "text-destructive drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]"}
							>
								{diffFromLastMonth > 0
									? `+${diffFromLastMonth.toFixed(1)}`
									: diffFromLastMonth.toFixed(1)}
								%
							</span>{" "}
							VS PREV LEVEL
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
		<Card className="rounded-none border border-primary/20 bg-[#05050A]/80 shadow-[0_0_15px_rgba(0,240,255,0.02)] transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)] group relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
				<CardTitle className="text-sm font-mono tracking-widest text-primary flex items-center gap-2">
					<div className="w-2 h-2 rounded-sm bg-primary animate-pulse shadow-[0_0_5px_rgba(var(--primary),0.8)]" />
					{options[selected]?.title}
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
