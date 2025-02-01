import { WeekdayChart } from "./(cheat-meals)/(weekday-chart)/weekday-chart";
import SelectCheckOptions from "@/components/select-check-options";
import CheckOptionThisMonthCard from "@/components/dashboard/check-option-this-month-card";
import CheckOptionThisYearCard from "@/components/dashboard/check-option-this-year-card";
import CheckOptionAveragePerMonthCard from "@/components/dashboard/check-option-average-this-month-card";
import DaysSinceLastCheckOptionCard from "@/components/dashboard/days-since-last-check-option";
import { FrequencyChart } from "@/components/dashboard/frequency-chart";

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
  console.log(selected);

  return (
    <main className="flex flex-col gap-4">
      <div className="flex gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <SelectCheckOptions selected={selected} />
      </div>

      <div className="flex flex-col sm:grid sm:grid-cols-4 gap-4">
        <CheckOptionThisYearCard selected={selected} />
        <CheckOptionAveragePerMonthCard selected={selected} />
        <CheckOptionThisMonthCard selected={selected} />
        <DaysSinceLastCheckOptionCard selected={selected} />
      </div>

      <div className="flex flex-col sm:grid sm:grid-cols-9 gap-4">
        <FrequencyChart selected={selected} />
        <WeekdayChart />
      </div>
    </main>
  );
}
