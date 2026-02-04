"use client";

import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";
import * as React from "react";
import {
	type DayButton,
	DayPicker,
	getDefaultClassNames,
} from "react-day-picker";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = "label",
	buttonVariant = "ghost",
	formatters,
	components,
	workoutDates,
	workoutColorsByDate,
	cheatMealDates,
	gymChecksByDate,
	onQuickToggle,
	...props
}: React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>["variant"];
	workoutDates?: Set<string>;
	workoutColorsByDate?: Map<string, string[]>;
	cheatMealDates?: Set<string>;
	gymChecksByDate?: Map<string, { id: string }>;
	onQuickToggle?: (date: Date, gymCheckId?: string) => void;
}) {
	const defaultClassNames = getDefaultClassNames();

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				"bg-white group/calendar p-3 [--cell-size:--spacing(10)] sm:[--cell-size:--spacing(12)] md:[--cell-size:--spacing(16)] lg:[--cell-size:--spacing(26)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent dark:bg-neutral-950",
				String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
				String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
				className,
			)}
			captionLayout={captionLayout}
			formatters={{
				formatMonthDropdown: (date) =>
					date.toLocaleString("default", { month: "long" }),
				...formatters,
			}}
			classNames={{
				root: cn("w-full", defaultClassNames.root),
				months: cn(
					"flex gap-4 flex-col md:flex-row relative",
					defaultClassNames.months,
				),
				month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
				nav: cn(
					"flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
					defaultClassNames.nav,
				),
				button_previous: cn(
					buttonVariants({ variant: buttonVariant }),
					"size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
					defaultClassNames.button_previous,
				),
				button_next: cn(
					buttonVariants({ variant: buttonVariant }),
					"size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
					defaultClassNames.button_next,
				),
				month_caption: cn(
					"flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
					defaultClassNames.month_caption,
				),
				dropdowns: cn(
					"w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
					defaultClassNames.dropdowns,
				),
				dropdown_root: cn(
					"relative has-focus:border-neutral-950 border border-neutral-200 shadow-xs has-focus:ring-neutral-950/50 has-focus:ring-[3px] rounded-md dark:has-focus:border-neutral-300 dark:border-neutral-800 dark:has-focus:ring-neutral-300/50",
					defaultClassNames.dropdown_root,
				),
				dropdown: cn("absolute inset-0 opacity-0", defaultClassNames.dropdown),
				caption_label: cn(
					"select-none font-medium",
					captionLayout === "label"
						? "text-sm"
						: "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-neutral-500 [&>svg]:size-3.5 dark:[&>svg]:text-neutral-400",
					defaultClassNames.caption_label,
				),
				table: "w-full border-collapse",
				weekdays: cn("flex", defaultClassNames.weekdays),
				weekday: cn(
					"text-neutral-500 rounded-md flex-1 font-normal text-[0.8rem] select-none dark:text-neutral-400",
					defaultClassNames.weekday,
				),
				week: cn("flex w-full mt-2", defaultClassNames.week),
				week_number_header: cn(
					"select-none w-(--cell-size)",
					defaultClassNames.week_number_header,
				),
				week_number: cn(
					"text-[0.8rem] select-none text-neutral-500 dark:text-neutral-400",
					defaultClassNames.week_number,
				),
				day: cn(
					"relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square md:aspect-auto select-none",
					defaultClassNames.day,
				),
				range_start: cn(
					"rounded-l-md bg-neutral-100 dark:bg-neutral-800",
					defaultClassNames.range_start,
				),
				range_middle: cn("rounded-none", defaultClassNames.range_middle),
				range_end: cn(
					"rounded-r-md bg-neutral-100 dark:bg-neutral-800",
					defaultClassNames.range_end,
				),
				today: cn(
					"bg-neutral-100 text-neutral-900 rounded-md data-[selected=true]:rounded-none dark:bg-neutral-800 dark:text-neutral-50",
					defaultClassNames.today,
				),
				outside: cn(
					"text-neutral-500 aria-selected:text-neutral-500 dark:text-neutral-400 dark:aria-selected:text-neutral-400",
					defaultClassNames.outside,
				),
				disabled: cn(
					"text-neutral-500 opacity-50 dark:text-neutral-400",
					defaultClassNames.disabled,
				),
				hidden: cn("invisible", defaultClassNames.hidden),
				...classNames,
			}}
			components={{
				Root: ({ className, rootRef, ...props }) => {
					return (
						<div
							data-slot="calendar"
							ref={rootRef}
							className={cn(className)}
							{...props}
						/>
					);
				},
				Chevron: ({ className, orientation, ...props }) => {
					if (orientation === "left") {
						return (
							<ChevronLeftIcon className={cn("size-4", className)} {...props} />
						);
					}

					if (orientation === "right") {
						return (
							<ChevronRightIcon
								className={cn("size-4", className)}
								{...props}
							/>
						);
					}

					return (
						<ChevronDownIcon className={cn("size-4", className)} {...props} />
					);
				},
				DayButton: (dayButtonProps) => (
					<CalendarDayButton
						{...dayButtonProps}
						workoutDates={workoutDates}
						workoutColorsByDate={workoutColorsByDate}
						cheatMealDates={cheatMealDates}
						gymChecksByDate={gymChecksByDate}
						onQuickToggle={onQuickToggle}
					/>
				),
				WeekNumber: ({ children, ...props }) => {
					return (
						<td {...props}>
							<div className="flex size-(--cell-size) items-center justify-center text-center">
								{children}
							</div>
						</td>
					);
				},
				...components,
			}}
			{...props}
		/>
	);
}

function formatDateKey(date: Date): string {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function CalendarDayButton({
	className,
	day,
	modifiers,
	workoutDates,
	workoutColorsByDate,
	cheatMealDates,
	gymChecksByDate,
	onQuickToggle,
	...props
}: React.ComponentProps<typeof DayButton> & {
	workoutDates?: Set<string>;
	workoutColorsByDate?: Map<string, string[]>;
	cheatMealDates?: Set<string>;
	gymChecksByDate?: Map<string, { id: string }>;
	onQuickToggle?: (date: Date, gymCheckId?: string) => void;
}) {
	const defaultClassNames = getDefaultClassNames();

	const ref = React.useRef<HTMLButtonElement>(null);
	React.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);

	const dateKey = formatDateKey(day.date);
	const hasWorkout = workoutDates?.has(dateKey);
	const hasCheatMeal = cheatMealDates?.has(dateKey);
	const hasData = hasWorkout || hasCheatMeal;
	const gymCheck = gymChecksByDate?.get(dateKey);
	const workoutColors = workoutColorsByDate?.get(dateKey) ?? [];

	const handleDoubleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (onQuickToggle && !modifiers.disabled) {
			onQuickToggle(day.date, gymCheck?.id);
		}
	};

	return (
		<Button
			ref={ref}
			variant="ghost"
			size="icon"
			data-day={day.date.toLocaleDateString()}
			data-selected-single={
				modifiers.selected &&
				!modifiers.range_start &&
				!modifiers.range_end &&
				!modifiers.range_middle
			}
			data-range-start={modifiers.range_start}
			data-range-end={modifiers.range_end}
			data-range-middle={modifiers.range_middle}
			data-has-data={hasData}
			className={cn(
				"data-[selected-single=true]:bg-neutral-900 data-[selected-single=true]:text-neutral-50 data-[range-middle=true]:bg-neutral-100 data-[range-middle=true]:text-neutral-900 data-[range-start=true]:bg-neutral-900 data-[range-start=true]:text-neutral-50 data-[range-end=true]:bg-neutral-900 data-[range-end=true]:text-neutral-50 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-neutral-900 flex aspect-square md:aspect-auto size-auto w-full min-w-(--cell-size) md:min-h-(--cell-size) flex-col gap-0.5 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70 dark:data-[selected-single=true]:bg-neutral-50 dark:data-[selected-single=true]:text-neutral-900 dark:data-[range-middle=true]:bg-neutral-800 dark:data-[range-middle=true]:text-neutral-50 dark:data-[range-start=true]:bg-neutral-50 dark:data-[range-start=true]:text-neutral-900 dark:data-[range-end=true]:bg-neutral-50 dark:data-[range-end=true]:text-neutral-900 dark:dark:hover:text-neutral-50",
				defaultClassNames.day,
				className,
			)}
			onDoubleClick={handleDoubleClick}
			{...props}
		>
			{props.children}
			{(hasData || workoutColors.length > 0) && (
				<div className="flex gap-0.5 justify-center items-center">
					{workoutColors.slice(0, 3).map((color, index) => (
						<span
							key={index}
							className="size-1.5 rounded-full"
							style={{ backgroundColor: color }}
						/>
					))}
					{workoutColors.length > 3 && (
						<span className="text-[0.6rem] leading-none">+</span>
					)}
					{hasCheatMeal && (
						<span className="size-1.5 rounded-full bg-vibrant-orange shadow-[0_0_4px_var(--vibrant-orange)]" />
					)}
				</div>
			)}
		</Button>
	);
}

export { Calendar, CalendarDayButton, formatDateKey };
