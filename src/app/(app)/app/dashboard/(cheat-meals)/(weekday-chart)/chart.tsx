"use client";

import { Label, Pie, PieChart } from "recharts";

import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { useEffect, useMemo, useState } from "react";
import { fetchCheatMealsByYearGroupedByMonth } from "@/actions/actions";
import { format } from "date-fns";
import { ChartSkeleton } from "./chart-skeleton";

type ChartData = {
  weekday: string;
  cheatMeals: number;
};

export function Chart() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const chartConfig = {
    cheatMeals: {
      label: "Cheat Meals",
    },
    ...chartData.reduce(
      (
        acc: { [key: string]: { label: string; color: string } },
        item,
        index
      ) => {
        acc[item.weekday] = {
          label: item.weekday,
          color: `hsl(var(--chart-${index + 1}))`,
        };
        return acc;
      },
      {}
    ),
  } satisfies ChartConfig;

  const totalCheatMeals = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.cheatMeals, 0);
  }, [chartData]);

  useEffect(() => {
    async function fetchData() {
      const { hashTable } = await fetchCheatMealsByYearGroupedByMonth();

      const weekdaysTable: { [key: string]: number } = {};
      for (const cheatMeal of Object.values(hashTable).flat()) {
        const weekday = format(cheatMeal.date, "eeee");
        if (weekdaysTable[weekday]) {
          weekdaysTable[weekday] += 1;
        } else {
          weekdaysTable[weekday] = 1;
        }
      }

      const lowestCheatMealWeekdays = [];
      let i = Object.keys(weekdaysTable).length;
      let totalOthersSum = 0;
      while (i > 4) {
        const minWeekday = getWeekdayWithLowestValue(weekdaysTable);
        if (minWeekday) {
          lowestCheatMealWeekdays.push(minWeekday);
          totalOthersSum += weekdaysTable[minWeekday];
          delete weekdaysTable[minWeekday];
        }

        i -= 1;
        if (i === 4) {
          weekdaysTable.Others = totalOthersSum;
        }
      }

      const fittedChartData = Object.entries(weekdaysTable).map(
        ([weekday, cheatMeals]) => {
          return {
            weekday,
            cheatMeals: cheatMeals,
            fill: `var(--color-${weekday})`,
          };
        }
      );

      setChartData(fittedChartData);
      setLoading(false);
    }

    fetchData();
  }, []);

  function getWeekdayWithLowestValue(weekdays: { [weekday: string]: number }) {
    let lowestKey = null;
    let lowestValue = Number.POSITIVE_INFINITY;

    for (const [key, value] of Object.entries(weekdays)) {
      if (value < lowestValue) {
        lowestValue = value;
        lowestKey = key;
      }
    }

    return lowestKey;
  }

  if (loading) {
    return <ChartSkeleton />;
  }

  return (
    <>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="cheatMeals"
              nameKey="weekday"
              innerRadius={60}
              strokeWidth={1}
              labelLine={true}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="var(--foreground)"
                  >
                    {payload.cheatMeals}
                  </text>
                );
              }}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCheatMeals.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-foreground"
                        >
                          Cheat meals
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="weekday" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </>
  );
}
