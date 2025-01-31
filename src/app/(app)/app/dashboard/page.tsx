import GymChecksThisYearCard from "./(gym-checks)/gym-checks-this-year-card";
import GymChecksThisMonthCard from "./(gym-checks)/gym-checks-this-month-card";
import CheatMealsThisMonthCard from "./(cheat-meals)/cheat-meals-this-week-card";
import DaysSinceLastCheatMealCard from "./(cheat-meals)/days-since-last-cheat-meal-card";
import { FrequencyChart } from "./(gym-checks)/(frequency-chart)/frequency-chart";
import { WeekdayChart } from "./(cheat-meals)/(weekday-chart)/weekday-chart";
import SelectCheckOptions from "@/components/select-check-options";
import CheckOptionThisMonthCard from "@/components/dashboard/check-option-this-month-card";

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

      <div className="grid grid-cols-4 gap-4">
        <GymChecksThisYearCard />
        {/* <GymChecksThisMonthCard /> */}
        {/* <AveragePerMonthCard /> */}
        {/* <CheatMealsThisMonthCard /> */}
        <CheckOptionThisMonthCard selected={selected} />
        <DaysSinceLastCheatMealCard />
      </div>

      <div className="grid grid-cols-9 gap-4">
        <FrequencyChart />
        <WeekdayChart />
      </div>
    </main>
  );
}
