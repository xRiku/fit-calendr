"use client";

import { useState } from "react";
import {
	type DayButton,
	DayPicker,
	getDefaultClassNames,
} from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, getInitials } from "@/lib/utils";
import type { CalendarMember, GroupCalendarData } from "@/lib/server-utils";

interface GroupCalendarTabProps {
	calendarData: GroupCalendarData;
	startDate: Date;
	endDate: Date;
}

function formatDateKey(date: Date): string {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function GroupCalendarTab({
	calendarData,
	startDate,
	endDate,
}: GroupCalendarTabProps) {
	const [selectedDay, setSelectedDay] = useState<string | null>(null);
	const selectedMembers = selectedDay ? (calendarData[selectedDay] ?? []) : [];

	const defaultClassNames = getDefaultClassNames();

	return (
		<div className="flex flex-col gap-3">
			<DayPicker
				locale={ptBR}
				fromDate={new Date(startDate)}
				toDate={new Date(endDate)}
				defaultMonth={new Date()}
				showOutsideDays={false}
				className={cn(
					"bg-transparent group/calendar p-0 w-full",
					"rtl:**:[.rdp-button\\_next>svg]:rotate-180",
					"rtl:**:[.rdp-button\\_previous>svg]:rotate-180",
				)}
				classNames={{
					root: cn("w-full", defaultClassNames.root),
					months: cn(
						"flex gap-4 flex-col relative",
						defaultClassNames.months,
					),
					month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
					nav: cn(
						"flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
						defaultClassNames.nav,
					),
					button_previous: cn(
						buttonVariants({ variant: "ghost" }),
						"size-9 p-0 select-none",
						defaultClassNames.button_previous,
					),
					button_next: cn(
						buttonVariants({ variant: "ghost" }),
						"size-9 p-0 select-none",
						defaultClassNames.button_next,
					),
					month_caption: cn(
						"flex items-center justify-center h-9 w-full px-9",
						defaultClassNames.month_caption,
					),
					caption_label: cn(
						"select-none font-medium text-sm capitalize",
						defaultClassNames.caption_label,
					),
					weekdays: cn("flex", defaultClassNames.weekdays),
					weekday: cn(
						"text-muted-foreground rounded-md flex-1 font-medium text-xs py-2 whitespace-nowrap select-none",
						defaultClassNames.weekday,
					),
					week: cn("flex w-full mt-1", defaultClassNames.week),
					day: cn(
						"relative w-full h-full p-0 text-center select-none",
						defaultClassNames.day,
					),
					outside: cn(
						"text-muted-foreground opacity-30",
						defaultClassNames.outside,
					),
					disabled: cn(
						"text-muted-foreground opacity-30",
						defaultClassNames.disabled,
					),
					hidden: cn("invisible", defaultClassNames.hidden),
				}}
				components={{
					Root: ({ className, rootRef, ...props }) => (
						<div
							data-slot="calendar"
							ref={rootRef}
							className={cn(className)}
							{...props}
						/>
					),
					Chevron: ({ className, orientation, ...props }) => {
						if (orientation === "left") {
							return (
								<ChevronLeftIcon
									className={cn("size-4", className)}
									{...props}
								/>
							);
						}
						return (
							<ChevronRightIcon
								className={cn("size-4", className)}
								{...props}
							/>
						);
					},
					DayButton: (dayButtonProps) => (
						<GroupCalendarDayButton
							{...dayButtonProps}
							calendarData={calendarData}
							selectedDay={selectedDay}
							onSelectDay={setSelectedDay}
						/>
					),
				}}
			/>

			{/* Selected day detail */}
			{selectedDay && (
				<div className="flex flex-col gap-2 rounded-xl border border-border px-4 py-3">
					<p className="text-xs font-medium text-muted-foreground">
						{new Date(selectedDay + "T12:00:00").toLocaleDateString("pt-BR", {
							weekday: "long",
							day: "numeric",
							month: "long",
						})}
					</p>
					{selectedMembers.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							Ninguém treinou neste dia
						</p>
					) : (
						<div className="flex flex-col gap-1.5">
							{selectedMembers.map((member) => (
								<div
									key={member.id}
									className="flex items-center gap-2"
								>
									<Avatar className="size-6 shrink-0">
										{member.avatarUrl && (
											<AvatarImage
												src={member.avatarUrl}
												alt={member.name}
											/>
										)}
										<AvatarFallback className="text-[10px] bg-neutral-800">
											{getInitials(member.name)}
										</AvatarFallback>
									</Avatar>
									<span className="text-sm">{member.name}</span>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function GroupCalendarDayButton({
	className,
	day,
	modifiers,
	calendarData,
	selectedDay,
	onSelectDay,
	...props
}: React.ComponentProps<typeof DayButton> & {
	calendarData: GroupCalendarData;
	selectedDay: string | null;
	onSelectDay: (day: string | null) => void;
}) {
	const defaultClassNames = getDefaultClassNames();
	const dateKey = formatDateKey(day.date);
	const members = calendarData[dateKey] ?? [];
	const isSelected = selectedDay === dateKey;

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		onSelectDay(isSelected ? null : dateKey);
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			data-day={day.date.toLocaleDateString()}
			className={cn(
				"relative flex aspect-square size-auto w-full min-h-11 flex-col items-center justify-start gap-0.5 pt-1.5 leading-none font-normal p-1 rounded-lg transition-colors",
				isSelected && "bg-white/10 ring-1 ring-vibrant-green/40",
				members.length > 0 && !isSelected && "hover:bg-white/5",
				defaultClassNames.day,
				className,
			)}
			onClick={handleClick}
			{...props}
		>
			<span className="text-xs">{props.children}</span>
			{members.length > 0 && (
				<div className="flex items-center justify-center gap-px mt-0.5">
					{members.slice(0, 3).map((member) => (
						<Avatar
							key={member.id}
							className="size-4 -ml-[2px] first:ml-0 ring-1 ring-background"
						>
							{member.avatarUrl && (
								<AvatarImage src={member.avatarUrl} alt={member.name} />
							)}
							<AvatarFallback className="text-[6px] bg-vibrant-green/20 text-vibrant-green">
								{getInitials(member.name)}
							</AvatarFallback>
						</Avatar>
					))}
					{members.length > 3 && (
						<span className="text-[7px] font-medium text-muted-foreground ml-px">
							+{members.length - 3}
						</span>
					)}
				</div>
			)}
		</Button>
	);
}
