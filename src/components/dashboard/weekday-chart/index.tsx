import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chart } from "./chart";
import {
  getGymChecksByYearGroupedByMonth,
  getCheatMealsByYearGroupedByMonth,
} from "@/lib/server-utils";
import { Suspense } from "react";
import { ChartSkeleton } from "./chart-skeleton";

const options: {
  [key: string]: {
    description: string;
    fetchCall:
      | typeof getGymChecksByYearGroupedByMonth
      | typeof getCheatMealsByYearGroupedByMonth;
  };
} = {
  "workout": {
    description: "Showing workout frequency per weekday for this year",
    fetchCall: getGymChecksByYearGroupedByMonth,
  },
  "cheat-meal": {
    description: "Showing cheat meal frequency per weekday for this year",
    fetchCall: getCheatMealsByYearGroupedByMonth,
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
