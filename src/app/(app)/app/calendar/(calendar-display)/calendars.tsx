import { Calendar } from "@/components/ui/calendar";
import {
  fetchCheatMealsByYearGroupedByMonth,
  fetchGymChecksByYearGroupedByMonth,
} from "@/lib/server-utils";
import { add } from "date-fns";

export default async function Calendars() {
  const cheatMealsGroupedByMonthPromise = fetchCheatMealsByYearGroupedByMonth();

  const gymChecksGroupedByMonthPromise = fetchGymChecksByYearGroupedByMonth();

  const [cheatMealsGroupedByMonth, gymChecksGroupedByMonth] = await Promise.all(
    [cheatMealsGroupedByMonthPromise, gymChecksGroupedByMonthPromise]
  );

  return Array.from({ length: 12 }).map((_, i) => {
    return (
      <Calendar
        key={`calendar-${i}`}
        disableNavigation
        showOutsideDays={false}
        defaultMonth={add(new Date(2025, 0, 15), {
          months: i,
        })}
        cheatMealModifiersArray={cheatMealsGroupedByMonth.hashTable[i]}
        gymModifiersArray={gymChecksGroupedByMonth.hashTable[i]}
      />
    );
  });
}
