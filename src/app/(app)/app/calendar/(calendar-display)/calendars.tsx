import {
  fetchCheatMealsByYearGroupedByMonth,
  fetchGymChecksByYearGroupedByMonth,
} from "@/actions/actions";
import H1 from "@/components/h1";
import { Calendar } from "@/components/ui/calendar";
import { add } from "date-fns";

export default async function Calendars() {
  const cheatMealsGroupedByMonthPromise: { [key: string]: any } =
    fetchCheatMealsByYearGroupedByMonth();

  const gymChecksGroupedByMonthPromise: { [key: string]: any } =
    fetchGymChecksByYearGroupedByMonth();

  const [cheatMealsGroupedByMonth, gymChecksGroupedByMonth] = await Promise.all(
    [cheatMealsGroupedByMonthPromise, gymChecksGroupedByMonthPromise]
  );

  return Array.from({ length: 12 }).map((_, i) => {
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
  });
}
