"use client";

import { cn } from "@/lib/utils";

const MONTH_LABELS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function getIntensity(count: number): 0 | 1 | 2 | 3 {
	if (count === 0) return 0;
	if (count === 1) return 1;
	if (count === 2) return 2;
	return 3;
}

const colorClasses = {
	workout: {
		0: "bg-muted",
		1: "bg-vibrant-green/30",
		2: "bg-vibrant-green/60",
		3: "bg-vibrant-green",
	},
	"cheat-meal": {
		0: "bg-muted",
		1: "bg-vibrant-orange/30",
		2: "bg-vibrant-orange/60",
		3: "bg-vibrant-orange",
	},
} as const;

type WeekColumn = {
	cells: { date: string; count: number; dayOfWeek: number }[];
};

function buildWeeks(
	year: number,
	data: Map<string, number>,
): { weeks: WeekColumn[]; monthStartWeeks: { label: string; week: number }[] } {
	const weeks: WeekColumn[] = [];
	const monthStartWeeks: { label: string; week: number }[] = [];

	const start = new Date(year, 0, 1);
	const end = new Date(year, 11, 31);

	// Pad to start on Monday (ISO week)
	const startDay = start.getDay();
	const mondayOffset = startDay === 0 ? -6 : 1 - startDay;
	const gridStart = new Date(year, 0, 1 + mondayOffset);

	let currentWeek: WeekColumn = { cells: [] };
	let weekIndex = 0;
	const seenMonths = new Set<number>();

	const cursor = new Date(gridStart);
	while (cursor <= end || currentWeek.cells.length > 0) {
		const dayOfWeek = cursor.getDay() === 0 ? 6 : cursor.getDay() - 1; // Mon=0, Sun=6
		const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
		const isInYear =
			cursor.getFullYear() === year || (cursor < start && dayOfWeek < 6);

		currentWeek.cells.push({
			date: key,
			count:
				isInYear && cursor.getFullYear() === year ? (data.get(key) ?? 0) : -1,
			dayOfWeek,
		});

		// Track month labels
		if (cursor.getFullYear() === year && !seenMonths.has(cursor.getMonth())) {
			seenMonths.add(cursor.getMonth());
			monthStartWeeks.push({
				label: MONTH_LABELS[cursor.getMonth()],
				week: weekIndex,
			});
		}

		if (dayOfWeek === 6) {
			weeks.push(currentWeek);
			currentWeek = { cells: [] };
			weekIndex++;
		}

		cursor.setDate(cursor.getDate() + 1);

		if (cursor > end && currentWeek.cells.length === 0) break;
	}

	// Push last incomplete week
	if (currentWeek.cells.length > 0) {
		weeks.push(currentWeek);
	}

	return { weeks, monthStartWeeks };
}

export function HeatmapGrid({
	data,
	year,
	selected,
}: {
	data: Map<string, number>;
	year: number;
	selected: "workout" | "cheat-meal";
}) {
	const { weeks, monthStartWeeks } = buildWeeks(year, data);
	const colors = colorClasses[selected];

	return (
		<div className="overflow-x-auto pb-2">
			<div className="inline-flex flex-col gap-1 min-w-fit">
				{/* Month labels */}
				<div className="flex ml-8">
					{weeks.map((_, weekIdx) => {
						const monthEntry = monthStartWeeks.find((m) => m.week === weekIdx);
						return (
							<div
								key={weekIdx}
								className="w-[13px] mx-[1.5px] text-[10px] text-muted-foreground leading-none"
							>
								{monthEntry?.label ?? ""}
							</div>
						);
					})}
				</div>

				{/* Grid rows (Mon-Sun) */}
				{Array.from({ length: 7 }).map((_, dayIdx) => (
					<div key={dayIdx} className="flex items-center gap-0">
						<span className="w-8 text-[10px] text-muted-foreground text-right pr-2 leading-none">
							{DAY_LABELS[dayIdx]}
						</span>
						{weeks.map((week, weekIdx) => {
							const cell = week.cells.find((c) => c.dayOfWeek === dayIdx);
							if (!cell || cell.count === -1) {
								return (
									<div
										key={weekIdx}
										className="w-[13px] h-[13px] mx-[1.5px] rounded-sm"
									/>
								);
							}
							const intensity = getIntensity(cell.count);
							return (
								<div
									key={weekIdx}
									title={`${cell.date}: ${cell.count}`}
									className={cn(
										"w-[13px] h-[13px] mx-[1.5px] rounded-sm transition-colors",
										colors[intensity],
									)}
								/>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}
