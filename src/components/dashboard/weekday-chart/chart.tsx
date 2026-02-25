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
import { use } from "react";

import { format } from "date-fns";

const options: {
	[key: string]: {
		title: string;
		color?: string;
	};
} = {
	workout: {
		title: "Workouts",
		color: "var(--primary)",
	},
	"cheat-meal": {
		title: "Cheat meals",
		color: "var(--secondary)",
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
	const { hashTable } = use(fetchCallPromise);

	const weekdaysTable: { [key: string]: number } = {};
	for (const checkOption of Object.values(hashTable).flat()) {
		const weekday = format((checkOption as { date: Date }).date, "eeee");
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

	const chartData = Object.entries(weekdaysTable).map(
		([weekday, checkOption]) => {
			return {
				weekday,
				checkOption: checkOption,
				fill: `var(--chart-${weekday}-${selected})`,
			};
		},
	);

	const totalCheckOption = chartData.reduce(
		(acc, curr) => acc + curr.checkOption,
		0,
	);

	const chartConfig = {
		checkOption: {
			label: options[selected].title,
		},
		...chartData.reduce(
			(
				acc: { [key: string]: { label: string; color: string } },
				item,
				index,
			) => {
				acc[item.weekday] = {
					label: item.weekday,
					color: `hsl(var(--chart-${index + 1}))`,
				};
				return acc;
			},
			{},
		),
	} satisfies ChartConfig;

	// const totalCheckOption = useMemo(() => {
	//   return chartData.reduce((acc, curr) => acc + curr.checkOption, 0);
	// }, [chartData]);

	// useEffect(() => {
	//   async function fetchData() {
	//     const { hashTable } = await options[selected].fetchCall();
	//     // const { hashTable } = await fetchCheatMealsByYearGroupedByMonth();

	//     const weekdaysTable: { [key: string]: number } = {};
	//     for (const checkOption of Object.values(hashTable).flat()) {
	//       const weekday = format((checkOption as { date: Date }).date, "eeee");
	//       if (weekdaysTable[weekday]) {
	//         weekdaysTable[weekday] += 1;
	//       } else {
	//         weekdaysTable[weekday] = 1;
	//       }
	//     }

	//     const lowestCheatMealWeekdays = [];
	//     let i = Object.keys(weekdaysTable).length;
	//     let totalOthersSum = 0;
	//     while (i > 4) {
	//       const minWeekday = getWeekdayWithLowestValue(weekdaysTable);
	//       if (minWeekday) {
	//         lowestCheatMealWeekdays.push(minWeekday);
	//         totalOthersSum += weekdaysTable[minWeekday];
	//         delete weekdaysTable[minWeekday];
	//       }

	//       i -= 1;
	//       if (i === 4) {
	//         weekdaysTable.Others = totalOthersSum;
	//       }
	//     }

	//     const fittedChartData = Object.entries(weekdaysTable).map(
	//       ([weekday, checkOption]) => {
	//         return {
	//           weekday,
	//           checkOption: checkOption,
	//           fill: `var(--color-${weekday})`,
	//         };
	//       }
	//     );

	//     setChartData(fittedChartData);
	//     setLoading(false);
	//   }

	//   fetchData();
	// }, [selected]);

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

	// if (loading) {
	//   return <ChartSkeleton />;
	// }

	return (
		<CardContent className="h-[300px]">
			<ChartContainer config={chartConfig} className="h-[300px] w-full">
				<PieChart>
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent hideLabel />}
					/>
					<Pie
						data={chartData}
						dataKey="checkOption"
						nameKey="weekday"
						innerRadius={60}
						strokeWidth={1}
						animationEasing="ease-out"
						animationDuration={1000}
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
									{payload.checkOption}
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
												{totalCheckOption.toLocaleString()}
											</tspan>
											<tspan
												x={viewBox.cx}
												y={(viewBox.cy || 0) + 24}
												className="fill-foreground"
											>
												{options[selected].title}
											</tspan>
										</text>
									);
								}
							}}
						/>
					</Pie>
					<ChartLegend
						content={<ChartLegendContent nameKey="weekday" />}
						className="h-auto flex-wrap gap-2 justify-center pb-4"
					/>
				</PieChart>
			</ChartContainer>
		</CardContent>
	);
}
