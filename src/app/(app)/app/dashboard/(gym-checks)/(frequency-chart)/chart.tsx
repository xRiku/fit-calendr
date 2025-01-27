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
import { fetchGymChecksByYearGroupedByMonth } from "@/actions/actions";
import { format } from "date-fns";
import { ChartSkeleton } from "./chart-skeleton";

const chartConfig = {
  gymCheck: {
    label: "Gym checks",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

type ChartData = {
  month: string;
  gymCheck: number;
};

export function Chart() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchGymChecksByYearGroupedByMonth();

      const lastMonthNumber = Number.parseInt(
        Object.keys(data.hashTable)[Object.keys(data.hashTable).length - 1]
      );

      const fittedChartData = Array.from({ length: lastMonthNumber + 1 }).map(
        (_, index) => {
          return {
            month: format(new Date(1, index), "LLLL"),
            gymCheck: data.hashTable[index]?.length || 0,
          };
        }
      );

      console.log(fittedChartData);

      // const fittedChartData = Object.keys(data.hashTable).map(
      //   (value: string) => {
      //     return {
      //       month: format(new Date(1, Number.parseInt(value)), "LLLL"),
      //       gymCheck: data.hashTable[value].length,
      //     };
      //   }
      // );

      // const filledChartData = Array.from({ length: lastMonthNumber + 1 }).map(
      //   (_, index) => {
      //     const filteredMonthLabel =  fittedChartData.find(() => {

      //     })
      //     if (fittedChartData[format(new Date(1, index), "LLLL")]) {
      //       return fittedChartData[format(new Date(1, index), "LLLL")];
      //     }

      //     return {
      //       month: format(new Date(1, index), "LLLL"),
      //       gymCheck: 0,
      //     };
      //   }
      // );

      setChartData(fittedChartData);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <ChartSkeleton />;
  }

  return (
    <>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              barSize={100}
              dataKey="gymCheck"
              fill="var(--primary)"
              radius={4}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
          {/* <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="gymCheck"
              type="natural"
              fill="var(--primary)"
              fillOpacity={0.4}
              stroke="var(--primary)"
            />
          </AreaChart> */}
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
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
