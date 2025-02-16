import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Chart } from "./chart";
import {
  fetchCheatMealsByYearGroupedByMonth,
  fetchGymChecksByYearGroupedByMonth,
} from "@/lib/server-utils";
import { Suspense } from "react";
import { ChartSkeleton } from "./chart-skeleton";

const options: {
  [key: string]: {
    title: string;
    description: string;
    fetchCall:
      | typeof fetchGymChecksByYearGroupedByMonth
      | typeof fetchCheatMealsByYearGroupedByMonth;
  };
} = {
  "gym-workout": {
    title: "Gym Workout Frequency Chart",
    description: "Showing gym workout frequency for this year",
    fetchCall: fetchGymChecksByYearGroupedByMonth,
  },
  "cheat-meal": {
    title: "Cheat Meal Frequency Chart",
    description: "Showing cheat meal frequency for this year",
    fetchCall: fetchCheatMealsByYearGroupedByMonth,
  },
};

export function FrequencyChart({ selected }: { selected: string }) {
  const fetchCallPromise = options[selected].fetchCall();

  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle>{options[selected].title}</CardTitle>
        <CardDescription>{options[selected].description}</CardDescription>
      </CardHeader>
      <Suspense fallback={<ChartSkeleton />}>
        <Chart selected={selected} fetchCallPromise={fetchCallPromise} />
      </Suspense>
    </Card>
  );
}
