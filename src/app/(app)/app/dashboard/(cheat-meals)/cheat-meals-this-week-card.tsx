import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CardSkeleton } from "../card-skeleton";
import { fetchCheatMealsByYearGroupedByMonth } from "@/actions/actions";
import { Suspense } from "react";

export default async function CheatMealsThisMonthCard() {
  async function CardData() {
    const cheatMealsGroupedByMonth =
      await fetchCheatMealsByYearGroupedByMonth();

    const getDiffFromLastMonth = () => {
      const thisMonth =
        cheatMealsGroupedByMonth.hashTable[new Date().getMonth()]?.length || 0;
      const prevMonth =
        cheatMealsGroupedByMonth.hashTable[new Date().getMonth() - 1]?.length ||
        0;

      if (thisMonth === 0 || prevMonth === 0) {
        return 0;
      }
      return (thisMonth / prevMonth - 1) * 100;
    };

    const diffFromLastMonth = getDiffFromLastMonth();

    return (
      <>
        {cheatMealsGroupedByMonth ? (
          <>
            <span className="text-2xl font-bold">
              {cheatMealsGroupedByMonth.hashTable[new Date().getMonth()]
                ?.length || 0}
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
                this month
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
          Cheat meals (month)
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
