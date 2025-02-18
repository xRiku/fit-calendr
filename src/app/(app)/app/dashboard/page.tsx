import SelectCheckOptions from "@/components/select-check-options";
import CheckOptionThisMonthCard from "@/components/dashboard/check-option-this-month-card";
import CheckOptionThisYearCard from "@/components/dashboard/check-option-this-year-card";
import CheckOptionAveragePerMonthCard from "@/components/dashboard/check-option-average-this-month-card";
import DaysSinceLastCheckOptionCard from "@/components/dashboard/days-since-last-check-option";
import { FrequencyChart } from "@/components/dashboard/frequency-chart";
import { WeekdayChart } from "@/components/dashboard/weekday-chart";
import H2 from "@/components/h2";

export type DashBoardPageProps = {
  searchParams: Promise<{
    [key: string]: "gym-workout" | "cheat-meal" | undefined;
  }>;
};

export default async function DashboardPage({
  searchParams,
}: DashBoardPageProps) {
  const params = await searchParams;
  const selected = params.selected ?? "gym-workout";

  return (
    <main className="flex flex-col gap-4 group">
      <div className="flex gap-6">
        <H2>Dashboard</H2>
        <SelectCheckOptions selected={selected} />
      </div>
      <div className="flex flex-col gap-4 group-has-[[data-pending]]:animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <CheckOptionThisYearCard selected={selected} />
          <CheckOptionAveragePerMonthCard selected={selected} />
          <CheckOptionThisMonthCard selected={selected} />
          <DaysSinceLastCheckOptionCard selected={selected} />
        </div>

        <div className="flex flex-col sm:grid sm:grid-cols-9 gap-4">
          <FrequencyChart selected={selected} />
          <WeekdayChart selected={selected} />
        </div>
      </div>
    </main>
  );
}
