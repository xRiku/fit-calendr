import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CardSkeleton } from "./card-skeleton";
import { getLastCheatMeal, getLastGymWorkout } from "@/actions/actions";
import { Suspense } from "react";
import { differenceInDays } from "date-fns";

const options: {
  [key: string]: {
    title: string;
    fetchCall: typeof getLastGymWorkout | typeof getLastCheatMeal;
  };
} = {
  "gym-workout": {
    title: "Days since last gym workout",
    fetchCall: getLastGymWorkout,
  },
  "cheat-meal": {
    title: "Days since last cheat meal",
    fetchCall: getLastCheatMeal,
  },
};

export default async function DaysSinceLastCheckOptionCard({
  selected,
}: {
  selected: string;
}) {
  async function CardData() {
    const lastCheckOption = await options[selected].fetchCall();

    let daysSinceLastCheckOption = 0;

    if (lastCheckOption.length) {
      daysSinceLastCheckOption = differenceInDays(
        new Date().getTime(),
        lastCheckOption[0].date.getTime() || new Date()
      );
    }

    return (
      <span className="text-2xl font-bold">{daysSinceLastCheckOption}</span>
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
