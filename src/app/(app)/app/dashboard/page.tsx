import { Suspense } from "react";
import CheckOptionThisMonthCard from "@/components/dashboard/check-option-this-month-card";
import CheckOptionThisYearCard from "@/components/dashboard/check-option-this-year-card";
import { DashboardEmptyState } from "@/components/dashboard/empty-state";
import { FrequencyChart } from "@/components/dashboard/frequency-chart";
import StreakCard from "@/components/dashboard/streak-card";
import { WeekdayChart } from "@/components/dashboard/weekday-chart";
import { YearlyHeatmap } from "@/components/dashboard/yearly-heatmap";
import H2 from "@/components/h2";
import SelectCheckOptions from "@/components/select-check-options";
import SelectYear from "@/components/select-year";
import { getAvailableYears, getUserTotalEntries } from "@/lib/server-utils";

export type DashBoardPageProps = {
	searchParams: Promise<{
		selected?: "workout" | "cheat-meal";
		year?: string;
	}>;
};

export default async function DashboardPage({
	searchParams,
}: DashBoardPageProps) {
	const params = await searchParams;
	const selected = params.selected ?? "workout";
	const [availableYears, { total }] = await Promise.all([
		getAvailableYears(),
		getUserTotalEntries(),
	]);
	const year = params.year
		? Number.parseInt(params.year, 10)
		: new Date().getFullYear();

	if (total === 0) {
		return (
			<main className="flex flex-col gap-4">
				<div className="flex py-2 gap-6 items-center flex-wrap">
					<H2>Dashboard</H2>
				</div>
				<DashboardEmptyState />
			</main>
		);
	}

	return (
		<main className="flex flex-col gap-4 group">
			<div className="flex py-2 gap-6 items-center flex-wrap">
				<H2>Dashboard</H2>
				<SelectCheckOptions selected={selected} />
				{availableYears.length > 1 && (
					<SelectYear availableYears={availableYears} selectedYear={year} />
				)}
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 group-has-data-pending:animate-pulse">
				{/* Overview Heatmap */}
				<div className="lg:col-span-3">
					<YearlyHeatmap selected={selected} year={year} />
				</div>

				{/* Welcome/Streak Banner (taking 2 cols on lg) */}
				<div className="lg:col-span-2 flex w-full">
					<StreakCard selected={selected} />
				</div>

				{/* 2-Column Stat Cards (taking 1 col on lg, stacked) */}
				<div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4">
					<CheckOptionThisMonthCard selected={selected} year={year} />
					<CheckOptionThisYearCard selected={selected} year={year} />
				</div>

				{/* Charts */}
				<div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-9 gap-4">
					<div className="sm:col-span-1 lg:col-span-5">
						<FrequencyChart selected={selected} year={year} />
					</div>
					<div className="sm:col-span-1 lg:col-span-4">
						<WeekdayChart selected={selected} year={year} />
					</div>
				</div>
			</div>
		</main>
	);
}
