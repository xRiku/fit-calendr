"use client";

import { Calendar, formatDateKey } from "@/components/ui/calendar";
import { useModalStore } from "@/stores/day-info-modal";
import type { CheatMeal, GymCheck } from "@/../prisma/generated/client";
import { useMemo } from "react";

type CalendarsProps = {
  gymChecks: GymCheck[];
  cheatMeals: CheatMeal[];
};

export default function Calendars({ gymChecks, cheatMeals }: CalendarsProps) {
  const { setSelectedDayInfo, toggleDayInfoModalState } = useModalStore();

  // Create date lookup maps for efficient checking
  const { workoutDates, cheatMealDates, gymChecksByDate, cheatMealsByDate } =
    useMemo(() => {
      const workoutDates = new Set<string>();
      const cheatMealDates = new Set<string>();
      const gymChecksByDate = new Map<string, GymCheck>();
      const cheatMealsByDate = new Map<string, CheatMeal>();

      for (const gymCheck of gymChecks) {
        const dateKey = formatDateKey(new Date(gymCheck.date));
        workoutDates.add(dateKey);
        gymChecksByDate.set(dateKey, gymCheck);
      }

      for (const cheatMeal of cheatMeals) {
        const dateKey = formatDateKey(new Date(cheatMeal.date));
        cheatMealDates.add(dateKey);
        cheatMealsByDate.set(dateKey, cheatMeal);
      }

      return {
        workoutDates,
        cheatMealDates,
        gymChecksByDate,
        cheatMealsByDate,
      };
    }, [gymChecks, cheatMeals]);

  const handleDayClick = (date: Date) => {
    if (date > new Date()) return;

    const dateKey = formatDateKey(date);
    const existingGymCheck = gymChecksByDate.get(dateKey);
    const existingCheatMeal = cheatMealsByDate.get(dateKey);

    const hasExistingData = existingGymCheck || existingCheatMeal;

    setSelectedDayInfo({
      date,
      gymCheck: existingGymCheck
        ? {
            id: existingGymCheck.id,
            description: existingGymCheck.description,
            userId: existingGymCheck.userId,
            updatedAt: existingGymCheck.updatedAt,
            createdAt: existingGymCheck.createdAt,
          }
        : undefined,
      cheatMeal: existingCheatMeal
        ? {
            id: existingCheatMeal.id,
            name: existingCheatMeal.name,
            userId: existingCheatMeal.userId,
            updatedAt: existingCheatMeal.updatedAt,
            createdAt: existingCheatMeal.createdAt,
          }
        : undefined,
    });

    toggleDayInfoModalState(hasExistingData ? "edit" : "create");
  };

  return (
    <Calendar
      className="w-full"
      captionLayout="dropdown"
      showOutsideDays={false}
      startMonth={new Date(2024, 0)}
      endMonth={new Date(2030, 11)}
      disabled={{ after: new Date() }}
      onDayClick={handleDayClick}
      workoutDates={workoutDates}
      cheatMealDates={cheatMealDates}
    />
  );
}
