"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, LabelList, Pie, PieChart } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  // { weekday: "monday", cheatMeals: 11, fill: "var(--color-monday)" },
  // { weekday: "tuesday", cheatMeals: 4, fill: "var(--color-tuesday)" },
  // { weekday: "wednesday", cheatMeals: 9, fill: "var(--color-wednesday)" },
  { weekday: "thursday", cheatMeals: 3, fill: "var(--color-thursday)" },
  { weekday: "friday", cheatMeals: 20, fill: "var(--color-friday)" },
  { weekday: "saturday", cheatMeals: 43, fill: "var(--color-saturday)" },
  { weekday: "sunday", cheatMeals: 33, fill: "var(--color-sunday)" },
  { weekday: "others", cheatMeals: 30, fill: "var(--color-others)" },
];

const chartConfig = {
  cheatMeals: {
    label: "Cheat Meals",
  },
  // monday: {
  //   label: "Monday",
  //   color: "hsl(var(--chart-1))",
  // },
  // tuesday: {
  //   label: "Tuesday",
  //   color: "hsl(var(--chart-2))",
  // },
  // wednesday: {
  //   label: "Wednesday",
  //   color: "hsl(var(--chart-3))",
  // },
  others: {
    label: "Others",
    color: "hsl(var(--chart-1))",
  },
  thursday: {
    label: "Thursday",
    color: "hsl(var(--chart-2))",
  },
  friday: {
    label: "Friday",
    color: "hsl(var(--chart-3))",
  },
  saturday: {
    label: "Saturday",
    color: "hsl(var(--chart-4))",
  },
  sunday: {
    label: "Sunday",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function Chart() {
  const totalCheatMeals = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.cheatMeals, 0);
  }, []);

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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        {/* <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </>
  );
}
