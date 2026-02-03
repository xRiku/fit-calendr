import H2 from "@/components/h2";
import QuickAddTodayButton from "@/components/quick-add-today-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import CalendarDataProvider from "./(calendar-display)/calendar-data-provider";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
	return (
		<>
			<H2>Calendar</H2>
			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<CardTitle className="text-base font-medium">
								Track Your Progress
							</CardTitle>
							<QuickAddTodayButton />
						</div>
						<div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
							<div className="flex items-center">
								<span className="size-2.5 mr-1.5 sm:mr-2 rounded-full bg-vibrant-green shadow-[0_0_6px_var(--vibrant-green)]" />
								<span className="text-muted-foreground">Workout</span>
							</div>
							<div className="flex items-center">
								<span className="size-2.5 mr-1.5 sm:mr-2 rounded-full bg-vibrant-orange shadow-[0_0_6px_var(--vibrant-orange)]" />
								<span className="text-muted-foreground">Cheat Meal</span>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Suspense
						fallback={
							<div className="animate-pulse h-80 w-full bg-muted rounded-lg" />
						}
					>
						<CalendarDataProvider />
					</Suspense>
				</CardContent>
			</Card>
		</>
	);
}
