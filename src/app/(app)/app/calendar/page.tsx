import {
  fetchCheatMealsByYearGroupedByMonth,
  fetchGymChecksByYearGroupedByMonth,
} from "@/actions/actions";
import { auth } from "@/auth";
import H1 from "@/components/h1";
import { Calendar } from "@/components/ui/calendar";
import { add } from "date-fns";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const cheatMealsGroupedByMonthPromise: { [key: string]: any } =
    fetchCheatMealsByYearGroupedByMonth();

  const gymChecksGroupedByMonthPromise: { [key: string]: any } =
    fetchGymChecksByYearGroupedByMonth();

  const [cheatMealsGroupedByMonth, gymChecksGroupedByMonth] = await Promise.all(
    [cheatMealsGroupedByMonthPromise, gymChecksGroupedByMonthPromise]
  );

  return (
    <>
      <H1 className="mb-8">Calendar</H1>
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="h-2 w-2 mr-2 rounded-xl bg-primary" /> Gym
        </div>
        <div className="flex items-center">
          <span className="h-2 w-2 mr-2 rounded-xl bg-secondary" /> Cheat Meal
        </div>
      </div>
      <div className="w-full flex items-start justify-start flex-wrap">
        {Array.from({ length: 12 }).map((_, i) => {
          return (
            <Calendar
              key={`calendar-${i}`}
              disableNavigation
              showOutsideDays={false}
              defaultMonth={add(new Date(2025, 0, 1), {
                months: i,
              })}
              cheatMealModifiersArray={cheatMealsGroupedByMonth.hashTable[i]}
              gymModifiersArray={gymChecksGroupedByMonth.hashTable[i]}
            />
          );
        })}
      </div>
    </>
  );
}
