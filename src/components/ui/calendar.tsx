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
	cheatMealColorsByDate,
	gymChecksByDate,
	onQuickToggle,
	...props
}: React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>["variant"];
	workoutDates?: Set<string>;
	workoutColorsByDate?: Map<string, string[]>;
	cheatMealDates?: Set<string>;
	cheatMealColorsByDate?: Map<string, string[]>;
	gymChecksByDate?: Map<string, { id: string }>;
	onQuickToggle?: (date: Date, gymCheckId?: string) => void;
}) {
	const defaultClassNames = getDefaultClassNames();

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				"bg-white group/calendar p-2 sm:p-3 [--cell-size:--spacing(11)] sm:[--cell-size:--spacing(14)] md:[--cell-size:--spacing(16)] lg:[--cell-size:--spacing(26)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent dark:bg-neutral-950",
				"rtl:**:[.rdp-button\\_next>svg]:rotate-180",
				"rtl:**:[.rdp-button\\_previous>svg]:rotate-180",
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
					"size-(--cell-size) min-w-[44px] min-h-[44px] aria-disabled:opacity-50 p-0 select-none active:scale-95 transition-transform",
					defaultClassNames.button_previous,
				),
				button_next: cn(
					buttonVariants({ variant: buttonVariant }),
					"size-(--cell-size) min-w-[44px] min-h-[44px] aria-disabled:opacity-50 p-0 select-none active:scale-95 transition-transform",
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
					"text-neutral-500 rounded-md flex-1 font-medium text-sm sm:text-[0.8rem] py-2 sm:py-1 whitespace-nowrap select-none dark:text-neutral-400",
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
						cheatMealColorsByDate={cheatMealColorsByDate}
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
	cheatMealColorsByDate,
	gymChecksByDate,
	onQuickToggle,
	...props
}: React.ComponentProps<typeof DayButton> & {
	workoutDates?: Set<string>;
	workoutColorsByDate?: Map<string, string[]>;
	cheatMealDates?: Set<string>;
	cheatMealColorsByDate?: Map<string, string[]>;
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
	const cheatMealColors = cheatMealColorsByDate?.get(dateKey) ?? [];

	// Long-press support for mobile quick toggle
	const [isPressing, setIsPressing] = React.useState(false);
	const pressTimer = React.useRef<NodeJS.Timeout | null>(null);
	const PRESS_DURATION = 500;

	const handleTouchStart = () => {
		if (modifiers.disabled || !onQuickToggle) return;
		setIsPressing(true);
		pressTimer.current = setTimeout(() => {
			onQuickToggle(day.date, gymCheck?.id);
			setIsPressing(false);
			if (navigator.vibrate) navigator.vibrate(50);
		}, PRESS_DURATION);
	};

	const handleTouchEnd = () => {
		setIsPressing(false);
		if (pressTimer.current) {
			clearTimeout(pressTimer.current);
			pressTimer.current = null;
		}
	};

	const handleTouchMove = () => {
		if (pressTimer.current) {
			clearTimeout(pressTimer.current);
			pressTimer.current = null;
		}
		setIsPressing(false);
	};

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
				"relative data-[selected-single=true]:bg-neutral-900 data-[selected-single=true]:text-neutral-50 data-[range-middle=true]:bg-neutral-100 data-[range-middle=true]:text-neutral-900 data-[range-start=true]:bg-neutral-900 data-[range-start=true]:text-neutral-50 data-[range-end=true]:bg-neutral-900 data-[range-end=true]:text-neutral-50 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-neutral-900 flex aspect-square md:aspect-auto size-auto w-full min-w-(--cell-size) min-h-(--cell-size) flex-col items-center justify-center leading-none font-normal group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70 dark:data-[selected-single=true]:bg-neutral-50 dark:data-[selected-single=true]:text-neutral-900 dark:data-[range-middle=true]:bg-neutral-800 dark:data-[range-middle=true]:text-neutral-50 dark:data-[range-start=true]:bg-neutral-50 dark:data-[range-start=true]:text-neutral-900 dark:data-[range-end=true]:bg-neutral-50 dark:data-[range-end=true]:text-neutral-900 dark:dark:hover:text-neutral-50 p-1 sm:p-2 transition-all duration-200",
				isPressing &&
				"scale-95 bg-neutral-100 dark:bg-neutral-800 ring-2 ring-primary/20",
				defaultClassNames.day,
				className,
			)}
			onDoubleClick={handleDoubleClick}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			onTouchMove={handleTouchMove}
			{...props}
		>
			{props.children}
			{(hasData || workoutColors.length > 0 || cheatMealColors.length > 0) && (
				<div className="absolute bottom-1.5 sm:bottom-2 left-0 right-0 flex gap-0.5 justify-center items-center flex-wrap content-end">
					{workoutColors.slice(0, 4).map((color, i) => (
						<span
							key={`w-dot-${color}-${i}`}
							className="size-1.5 sm:size-1.5 rounded-full"
							style={{ backgroundColor: color }}
						/>
					))}
					{workoutColors.length > 4 && (
						<span className="text-[0.5rem] sm:text-[0.6rem] leading-none font-medium text-neutral-400">
							+
						</span>
					)}
					{cheatMealColors.slice(0, 4).map((color, i) => (
						<span
							key={`c-dot-${color}-${i}`}
							className="size-1.5 sm:size-1.5 rounded-full shadow-[0_0_3px_var(--dot-color)]"
							style={{
								backgroundColor: color,
								["--dot-color" as string]: color,
							}}
						/>
					))}
					{cheatMealColors.length > 4 && (
						<span className="text-[0.5rem] sm:text-[0.6rem] leading-none font-medium text-neutral-400">
							+
						</span>
					)}
				</div>
			)}
		</Button>
	);
}

export { Calendar, CalendarDayButton, formatDateKey };
