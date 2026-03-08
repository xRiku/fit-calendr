"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import type { CalendarMember, GroupCalendarData } from "@/lib/server-utils";

interface GroupCalendarTabProps {
	calendarData: GroupCalendarData;
	startDate: Date;
	endDate: Date;
}

export function GroupCalendarTab({ calendarData }: GroupCalendarTabProps) {
	const days = Object.entries(calendarData)
		.filter(([, members]) => members.length > 0)
		.sort(([a], [b]) => b.localeCompare(a));

	if (days.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<p className="text-sm text-muted-foreground">
					Nenhum treino registrado ainda.
				</p>
			</div>
		);
	}

	// Group by month
	const months: { key: string; label: string; days: [string, CalendarMember[]][] }[] = [];
	for (const [dateKey, members] of days) {
		const monthKey = dateKey.slice(0, 7);
		const last = months[months.length - 1];
		if (last && last.key === monthKey) {
			last.days.push([dateKey, members]);
		} else {
			const label = new Date(`${monthKey}-01T12:00:00`).toLocaleDateString("pt-BR", {
				month: "long",
				year: "numeric",
			});
			months.push({ key: monthKey, label, days: [[dateKey, members]] });
		}
	}

	return (
		<div className="flex flex-col gap-6">
			{months.map((month) => (
				<div key={month.key} className="relative flex flex-col gap-0">
					{/* Gradient timeline line */}
					<div className="absolute left-[7px] top-6 bottom-0 w-px bg-linear-to-b from-vibrant-green/60 via-vibrant-green/15 to-transparent" />

					{/* Month header */}
					<div className="mb-3 pl-6">
						<span className="text-[10px] font-bold uppercase tracking-[0.15em] text-vibrant-green/70">
							{month.label}
						</span>
					</div>

					<div className="flex flex-col gap-3">
						{month.days.map(([dateKey, members]) => {
							const dateLabel = new Date(`${dateKey}T12:00:00`).toLocaleDateString(
								"pt-BR",
								{ weekday: "short", day: "numeric", month: "short" },
							);
							return (
								<div key={dateKey} className="flex items-start gap-3">
									{/* Timeline dot */}
									<div className="mt-2.5 size-[7px] shrink-0 rounded-full bg-vibrant-green/80 ring-2 ring-vibrant-green/20" />

									{/* Day card */}
									<div className="flex-1 rounded-xl border border-vibrant-green/10 bg-vibrant-green/[0.03] px-3 py-2.5 flex flex-col gap-2">
										<p className="text-xs font-semibold text-muted-foreground capitalize">
											{dateLabel}
										</p>
										<div className="flex flex-wrap gap-x-3 gap-y-2">
											{members.map((member) => (
												<div
													key={member.id}
													className="flex items-center gap-1.5"
												>
													<Avatar className="size-6 shrink-0">
														{member.avatarUrl && (
															<AvatarImage
																src={member.avatarUrl}
																alt={member.name}
															/>
														)}
														<AvatarFallback className="text-[9px] bg-vibrant-green/20 text-vibrant-green">
															{getInitials(member.name)}
														</AvatarFallback>
													</Avatar>
													<span className="text-xs text-foreground/80">{member.name}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
