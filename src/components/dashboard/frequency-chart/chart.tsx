"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { CardContent, CardFooter } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { use } from "react";

import { format } from "date-fns";

const options: {
	[key: string]: {
		title: string;
		color?: string;
	};
} = {
	workout: {
		title: "Workouts (year)",
		color: "var(--vibrant-green)",
	},
	"cheat-meal": {
		title: "Cheat meals (year)",
		color: "var(--vibrant-orange)",
	},
};

type ChartProps = {
	selected: string;
	fetchCallPromise: Promise<{
		hashTable: {
			[key: string]: {
				id: string;
				description?: string;
				name?: string;
				date: Date;
				userId: string;
				updatedAt: Date;
				createdAt: Date;
			}[];
		};
		count: number;
	}>;
};

export function Chart({ selected, fetchCallPromise }: ChartProps) {
	const data = use(fetchCallPromise);

	const hashTableKeys = Object.keys(data.hashTable);
	const lastMonthNumber =
		hashTableKeys.length > 0
			? Number.parseInt(hashTableKeys[hashTableKeys.length - 1])
			: new Date().getMonth();

	const chartData = Array.from({ length: lastMonthNumber + 1 }).map(
		(_, index) => {
			return {
				month: format(new Date(1, index), "LLLL"),
				checkOption: data.hashTable[index]?.length || 0,
			};
		},
	);

	const chartConfig = {
		checkOption: {
			label: options[selected].title,
			color: `hsl(${options[selected].color})`,
		},
	} satisfies ChartConfig;

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
