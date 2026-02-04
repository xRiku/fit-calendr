import CalendarSidebar from "@/components/calendar-sidebar";
import CalendarToolbar from "@/components/calendar-toolbar";
import { Suspense } from "react";
import CalendarDataProvider from "./(calendar-display)/calendar-data-provider";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
	return (
		<div className="flex flex-col h-[calc(100dvh-theme(spacing.14))] -mt-2">
			<CalendarToolbar />
			<div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0 overflow-y-auto">
				<div className="lg:flex-1 min-w-0 order-1 lg:order-2">
					<Suspense
						fallback={
							<div className="animate-pulse h-80 w-full bg-muted rounded-lg" />
						}
					>
						<CalendarDataProvider />
					</Suspense>
				</div>
				<div className="order-2 lg:order-1">
					<CalendarSidebar />
				</div>
			</div>
		</div>
	);
}
