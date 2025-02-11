"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { CardContent, CardFooter } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import {
  fetchCheatMealsByYearGroupedByMonth,
  fetchGymChecksByYearGroupedByMonth,
} from "@/actions/actions";
import { format } from "date-fns";
import { ChartSkeleton } from "./chart-skeleton";

type ChartData = {
  month: string;
  checkOption: number;
};

const options: {
  [key: string]: {
    title: string;
    fetchCall:
      | typeof fetchGymChecksByYearGroupedByMonth
      | typeof fetchCheatMealsByYearGroupedByMonth;
    color?: string;
  };
} = {
  "gym-workout": {
    title: "Gym workouts (year)",
    fetchCall: fetchGymChecksByYearGroupedByMonth,
    color: "var(--primary)",
  },
  "cheat-meal": {
    title: "Cheat meals (year)",
    fetchCall: fetchCheatMealsByYearGroupedByMonth,
    color: "var(--secondary)",
  },
};

export function Chart({ selected }: { selected: string }) {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const chartConfig = {
    checkOption: {
      label: options[selected].title,
      color: `hsl(${options[selected].color})`,
    },
  } satisfies ChartConfig;

  useEffect(() => {
    async function fetchData() {
      const data = await options[selected].fetchCall();

      const lastMonthNumber = Number.parseInt(
        Object.keys(data.hashTable)[Object.keys(data.hashTable).length - 1]
      );

      const fittedChartData = Array.from({ length: lastMonthNumber + 1 }).map(
        (_, index) => {
          return {
            month: format(new Date(1, index), "LLLL"),
            checkOption: data.hashTable[index]?.length || 0,
          };
        }
      );

      setChartData(fittedChartData);
      setLoading(false);
    }

    fetchData();
  }, [selected]);

  if (loading) {
    return <ChartSkeleton />;
  }

  return (
    <>
      <CardContent className="h-[200px] sm:h-[300px]">
        <ChartContainer
          config={chartConfig}
          className="h-[200px] sm:h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              barSize={100}
              dataKey="checkOption"
              fill={options[selected].color}
              radius={4}
            >
              <LabelList position="top" offset={12} fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none">
              {chartData.length === 1 &&
                `${chartData[0].month}
                ${new Date().getFullYear()}`}
              {chartData.length > 1 &&
                `${chartData[0].month} - ${
                  chartData[chartData.length - 1].month
                } ${new Date().getFullYear()}`}
            </div>
          </div>
        </div>
      </CardFooter>
    </>
  );
}
