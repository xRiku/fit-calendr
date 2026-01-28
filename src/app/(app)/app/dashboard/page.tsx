import SelectCheckOptions from "@/components/select-check-options";
import SelectYear from "@/components/select-year";
import CheckOptionThisMonthCard from "@/components/dashboard/check-option-this-month-card";
import CheckOptionThisYearCard from "@/components/dashboard/check-option-this-year-card";
import CheckOptionAveragePerMonthCard from "@/components/dashboard/check-option-average-this-month-card";
import DaysSinceLastCheckOptionCard from "@/components/dashboard/days-since-last-check-option";
import { FrequencyChart } from "@/components/dashboard/frequency-chart";
import { WeekdayChart } from "@/components/dashboard/weekday-chart";
import H2 from "@/components/h2";
import { getAvailableYears } from "@/lib/server-utils";

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
  const year = params.year ? Number.parseInt(params.year, 10) : new Date().getFullYear();

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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <CheckOptionThisYearCard selected={selected} year={year} />
          <CheckOptionAveragePerMonthCard selected={selected} year={year} />
          <CheckOptionThisMonthCard selected={selected} year={year} />
          <DaysSinceLastCheckOptionCard selected={selected} />
        </div>

        <div className="flex flex-col sm:grid sm:grid-cols-9 gap-4">
          <FrequencyChart selected={selected} year={year} />
          <WeekdayChart selected={selected} year={year} />
        </div>
      </div>
    </main>
  );
}
