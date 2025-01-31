import H1 from "@/components/h1";
import { Suspense } from "react";
import Calendars from "./(calendar-display)/calendars";
import CalendarSkeleton from "./(calendar-display)/calendar-skeleton";

export default async function CalendarPage() {
  return (
    <>
      <H1 className="sm:mb-8">Calendar</H1>
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="h-2 w-2 mr-2 rounded-xl bg-primary" /> Gym
        </div>
        <div className="flex items-center">
          <span className="h-2 w-2 mr-2 rounded-xl bg-secondary" /> Cheat Meal
        </div>
      </div>
      <div className="w-full flex items-start md:justify-start justify-center flex-wrap">
        <Suspense
          fallback={Array.from({ length: 12 }).map((item, index) => (
            <CalendarSkeleton key={`calendar-skeleton-${index}`} />
          ))}
        >
          <Calendars />
        </Suspense>
      </div>
    </>
  );
}
