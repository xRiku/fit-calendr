"use client";

import { Database, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
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

      const fittedChartData = Object.keys(data.hashTable).map((value) => {
        return {
          month: format(new Date(1, Number.parseInt(value)), "LLLL"),
          gymCheck: data.hashTable[value].length,
        };
      });

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
          <AreaChart
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
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            {/* <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div> */}
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
