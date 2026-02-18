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
	const availableYears = await getAvailableYears();
	const year = params.year
		? Number.parseInt(params.year, 10)
		: new Date().getFullYear();
	const { total } = await getUserTotalEntries();

	if (total === 0) {
		return (
			<main className="flex flex-col gap-4">
				<div className="flex gap-6 items-center flex-wrap">
					<H2>Dashboard</H2>
				</div>
				<DashboardEmptyState />
			</main>
		);
	}

	return (
		<main className="flex flex-col gap-4 group">
			<div className="flex gap-6 items-center flex-wrap">
				<H2>Dashboard</H2>
				<SelectCheckOptions selected={selected} />
				{availableYears.length > 1 && (
					<SelectYear availableYears={availableYears} selectedYear={year} />
				)}
			</div>
			<div className="flex flex-col gap-4 group-has-data-pending:animate-pulse">
				{/* Bento: heatmap + 2 stat cards */}
				<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:items-stretch">
					<div className="sm:col-span-3 [&>*]:h-full">
						<YearlyHeatmap selected={selected} year={year} />
					</div>
					<div className="flex flex-col gap-4 [&>*]:flex-1">
						<CheckOptionThisMonthCard selected={selected} year={year} />
						<CheckOptionThisYearCard selected={selected} year={year} />
					</div>
				</div>

				{/* Status banner */}
				<StreakCard selected={selected} />

				{/* Charts */}
				<div className="flex flex-col sm:grid sm:grid-cols-9 gap-4">
					<FrequencyChart selected={selected} year={year} />
					<WeekdayChart selected={selected} year={year} />
				</div>
			</div>
		</main>
	);
}
