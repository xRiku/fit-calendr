import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CardSkeleton } from "../card-skeleton";
import { fetchCheatMealsByYearGroupedByMonth } from "@/actions/actions";
import { Suspense } from "react";

export default async function CheatMealsThisMonthCard() {
  async function CardData() {
    const cheatMealsGroupedByMonth: { [key: string]: any } =
      await fetchCheatMealsByYearGroupedByMonth();

    return (
      <span className="text-2xl font-bold">
        {cheatMealsGroupedByMonth.hashTable[new Date().getMonth()]?.length || 0}
      </span>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Cheat meals (week)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {/* {monthReceipt ? (
          <>
            <span className="text-2xl font-bold">
              {monthReceipt.receipt.toLocaleString('pt-BR', {
                currency: 'BRL',
                style: 'currency',
              })}
            </span>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  monthReceipt.diffFromLastMonth > 0
                    ? 'text-emerald-500'
                    : 'text-red-500'
                }
              >
                {monthReceipt.diffFromLastMonth > 0
                  ? `+${monthReceipt.diffFromLastMonth}`
                  : monthReceipt.diffFromLastMonth}
                %
              </span>{' '}
              em relação ao mês passado
            </p>
          </>
        ) : (
          )} */}
        <Suspense fallback={<CardSkeleton />}>
          <CardData />
        </Suspense>
      </CardContent>
    </Card>
  );
}
