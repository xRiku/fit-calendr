"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
		color: string;
		gradientId: string;
	};
} = {
	workout: {
		title: "Workouts (year)",
		color: "var(--vibrant-green)",
		gradientId: "workoutGradient",
	},
	"cheat-meal": {
		title: "Cheat meals (year)",
		color: "var(--vibrant-orange)",
		gradientId: "cheatMealGradient",
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
		(_, index) => ({
			month: format(new Date(1, index), "LLLL"),
			checkOption: data.hashTable[index]?.length || 0,
		}),
	);

	const opt = options[selected];

	const chartConfig = {
		checkOption: {
			label: opt.title,
			color: opt.color,
		},
	} satisfies ChartConfig;

	const maxVal = Math.max(...chartData.map((d) => d.checkOption), 1);
	const yMin = 0;
	const yMax = maxVal + Math.ceil(maxVal * 0.2);

	return (
		<>
			<CardContent className="h-[200px] sm:h-[280px]">
				<ChartContainer
					config={chartConfig}
					className="h-[200px] sm:h-[280px] w-full"
				>
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{ top: 8, right: 4, bottom: 0, left: -20 }}
					>
						<defs>
							<linearGradient id={opt.gradientId} x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor={opt.color} stopOpacity={0.25} />
								<stop offset="100%" stopColor={opt.color} stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid
							vertical={false}
							strokeDasharray="3 3"
							stroke="hsl(var(--border))"
							strokeOpacity={0.4}
						/>
						<XAxis
							dataKey="month"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tick={{ fontSize: 12 }}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							allowDecimals={false}
							domain={[yMin, yMax]}
							tick={{ fontSize: 12 }}
							width={32}
						/>
						<ChartTooltip
							cursor={{ stroke: opt.color, strokeWidth: 1, strokeOpacity: 0.3 }}
							content={<ChartTooltipContent />}
						/>
						<Area
							type="monotone"
							dataKey="checkOption"
							stroke={opt.color}
							strokeWidth={2}
							fill={`url(#${opt.gradientId})`}
							dot={{ r: 3.5, fill: opt.color, strokeWidth: 0 }}
							activeDot={{
								r: 5,
								fill: opt.color,
								stroke: "hsl(var(--background))",
								strokeWidth: 2,
							}}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="text-xs text-muted-foreground">
				{chartData.length === 1
					? `${chartData[0].month} ${new Date().getFullYear()}`
					: `${chartData[0].month} – ${chartData[chartData.length - 1].month} ${new Date().getFullYear()}`}
			</CardFooter>
		</>
	);
}
