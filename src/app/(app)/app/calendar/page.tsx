import CalendarDataProvider from "./(calendar-display)/calendar-data-provider";
import H2 from "@/components/h2";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CalendarPage() {
  return (
    <>
      <H2>Calendar</H2>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Track Your Progress</CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <span className="size-2.5 mr-2 rounded-full bg-vibrant-green shadow-[0_0_6px_var(--vibrant-green)]" />
                <span className="text-muted-foreground">Workout</span>
              </div>
              <div className="flex items-center">
                <span className="size-2.5 mr-2 rounded-full bg-vibrant-orange shadow-[0_0_6px_var(--vibrant-orange)]" />
                <span className="text-muted-foreground">Cheat Meal</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full flex items-start xl:justify-start justify-center flex-wrap gap-4 sm:gap-6 2xl:gap-0">
            <Suspense fallback={<div className="animate-pulse h-80 w-72 bg-muted rounded-lg" />}>
              <CalendarDataProvider />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
