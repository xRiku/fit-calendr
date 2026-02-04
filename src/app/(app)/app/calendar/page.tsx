import CalendarSidebar from "@/components/calendar-sidebar";
import CalendarToolbar from "@/components/calendar-toolbar";
import { Suspense } from "react";
import CalendarDataProvider from "./(calendar-display)/calendar-data-provider";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
	return (
		<div className="flex flex-col flex-1 -mt-2">
			<CalendarToolbar />
			<div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0">
				<CalendarSidebar />
				<div className="flex-1 min-w-0">
					<Suspense
						fallback={
							<div className="animate-pulse h-80 w-full bg-muted rounded-lg" />
						}
					>
						<CalendarDataProvider />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
