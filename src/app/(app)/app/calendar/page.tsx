import CalendarSidebar from "@/components/calendar-sidebar";
import CalendarToolbar from "@/components/calendar-toolbar";
import { Suspense } from "react";
import CalendarDataProvider from "./(calendar-display)/calendar-data-provider";

export const dynamic = "force-dynamic";

export type CalendarPageProps = {
	searchParams: Promise<{
		add?: string;
	}>;
};

export default async function CalendarPage({
	searchParams,
}: CalendarPageProps) {
	const params = await searchParams;
	const autoOpenAdd = params.add === "true";

	return (
		<div className="flex flex-col h-[calc(100dvh-6.5rem)] -mt-2 lg:overflow-hidden">
			<CalendarToolbar />
			<div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0">
				<div className="lg:flex-1 min-w-0 order-1 lg:order-2">
					<Suspense
						fallback={
							<div className="animate-pulse h-80 w-full bg-muted rounded-lg" />
						}
					>
						<CalendarDataProvider autoOpenAdd={autoOpenAdd} />
					</Suspense>
				</div>
				<div className="order-2 lg:order-1 lg:h-full">
					<CalendarSidebar />
				</div>
			</div>
		</div>
	);
}
