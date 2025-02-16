import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chart } from "./chart";
import {
  fetchGymChecksByYearGroupedByMonth,
  fetchCheatMealsByYearGroupedByMonth,
} from "@/lib/server-utils";
import { Suspense } from "react";
import { ChartSkeleton } from "./chart-skeleton";

const options: {
  [key: string]: {
    description: string;
    fetchCall:
      | typeof fetchGymChecksByYearGroupedByMonth
      | typeof fetchCheatMealsByYearGroupedByMonth;
  };
} = {
  "gym-workout": {
    description: "Showing gym workout frequency per weekday for this year",
    fetchCall: fetchGymChecksByYearGroupedByMonth,
  },
  "cheat-meal": {
    description: "Showing cheat meal frequency per weekday for this year",
    fetchCall: fetchCheatMealsByYearGroupedByMonth,
  },
};

export function WeekdayChart({ selected }: { selected: string }) {
  const fetchCallPromise = options[selected].fetchCall();

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Weekday Frequency Chart</CardTitle>
        <CardDescription>{options[selected].description}</CardDescription>
      </CardHeader>
      <Suspense fallback={<ChartSkeleton />}>
        <Chart selected={selected} fetchCallPromise={fetchCallPromise} />
      </Suspense>
    </Card>
  );
}
