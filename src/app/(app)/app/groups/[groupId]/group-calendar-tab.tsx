import { CalendarDays } from "lucide-react";

export function GroupCalendarTab() {
	return (
		<div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
			<CalendarDays className="size-8" />
			<p className="text-sm">Em breve</p>
		</div>
	);
}
