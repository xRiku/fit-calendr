import { Calendar } from "@/components/ui/calendar";
import {
  getCheatMealsByYearGroupedByMonth,
  getGymChecksByYearGroupedByMonth,
} from "@/lib/server-utils";
import { add } from "date-fns";

export default async function Calendars() {
  // const cheatMealsGroupedByMonthPromise = getCheatMealsByYearGroupedByMonth();

  // const gymChecksGroupedByMonthPromise = getGymChecksByYearGroupedByMonth();

  // const [cheatMealsGroupedByMonth, gymChecksGroupedByMonth] = await Promise.all(
  //   [cheatMealsGroupedByMonthPromise, gymChecksGroupedByMonthPromise]
  // );

  // return Array.from({ length: 12 }).map((_, i) => {
    return (
      <Calendar
        disableNavigation
        showOutsideDays={false}
        // cheatMealModifiersArray={cheatMealsGroupedByMonth.hashTable[i]}
        // gymModifiersArray={gymChecksGroupedByMonth.hashTable[i]}
      />
    );
  // });
}
