import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CardSkeleton } from "./card-skeleton";

import { Suspense } from "react";
import {
  getGymChecksByYearGroupedByMonth,
  getCheatMealsByYearGroupedByMonth,
} from "@/lib/server-utils";

const options: {
  [key: string]: {
    title: string;
    fetchCall:
      | typeof getGymChecksByYearGroupedByMonth
      | typeof getCheatMealsByYearGroupedByMonth;
  };
} = {
  "gym-workout": {
    title: "Gym workouts (year)",
    fetchCall: getGymChecksByYearGroupedByMonth,
  },
  "cheat-meal": {
    title: "Cheat meals (year)",
    fetchCall: getCheatMealsByYearGroupedByMonth,
  },
};

export default async function CheckOptionThisYearCard({
  selected,
}: {
  selected: keyof typeof options;
}) {
  async function CardData() {
    const gymChecksGroupedByMonth = await options[selected].fetchCall();

    const getDiffFromLastMonth = async () => {
      const thisYear = gymChecksGroupedByMonth.count || 0;
      if (thisYear === 0) {
        return 0;
      }

      const lastYearGymChecksGroupedByMonth =
        await getGymChecksByYearGroupedByMonth({
          year: new Date().getFullYear() - 1,
        });
      const prevYear = lastYearGymChecksGroupedByMonth?.count || 0;

      if (prevYear === 0) {
        return 0;
      }

      return (thisYear / prevYear - 1) * 100;
    };

    const diffFromLastMonth = await getDiffFromLastMonth();

    return (
      <>
        {gymChecksGroupedByMonth ? (
          <>
            <span className="text-2xl font-bold">
              {gymChecksGroupedByMonth.count || 0}
            </span>
            {diffFromLastMonth !== 0 && (
              <p className="text-xs text-muted-foreground">
                {diffFromLastMonth > 0 ? "Up by " : "Down by "}
                <span
                  className={
                    diffFromLastMonth > 0 ? "text-emerald-500" : "text-red-500"
                  }
                >
                  {diffFromLastMonth > 0
                    ? `+${diffFromLastMonth.toFixed(1)}`
                    : diffFromLastMonth.toFixed(1)}
                  %
                </span>{" "}
                this year
              </p>
            )}
          </>
        ) : (
          <></>
        )}
      </>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          {options[selected].title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <Suspense fallback={<CardSkeleton />}>
          <CardData />
        </Suspense>
      </CardContent>
    </Card>
  );
}
