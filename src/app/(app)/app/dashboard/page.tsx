import GymChecksThisYearCard from "./(gym-checks)/gym-checks-this-year-card";
import GymChecksThisMonthCard from "./(gym-checks)/gym-checks-this-month-card";
import CheatMealsThisMonthCard from "./(cheat-meals)/cheat-meals-this-week-card";
import DaysSinceLastCheatMealCard from "./(cheat-meals)/days-since-last-cheat-meal-card";
import { FrequencyChart } from "./(gym-checks)/(frequency-chart)/frequency-chart";

export default async function DashboardPage() {
  return (
    <main className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <GymChecksThisYearCard />
        <GymChecksThisMonthCard />
        <CheatMealsThisMonthCard />
        <DaysSinceLastCheatMealCard />
      </div>

      <div className="grid grid-cols-9 gap-4">
        <FrequencyChart />
      </div>
    </main>
  );
}
