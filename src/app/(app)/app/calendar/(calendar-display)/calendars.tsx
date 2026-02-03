"use client";

import type { CheatMeal, GymCheck } from "@/../prisma/generated/client";
import { quickToggleWorkout } from "@/actions/actions";
import { Calendar, formatDateKey } from "@/components/ui/calendar";
import { useModalStore } from "@/stores/day-info-modal";
import { useMemo } from "react";
import { toast } from "sonner";

type GymCheckWithPreset = GymCheck & {
	preset?: { id: string; label: string; color: string } | null;
};

type CalendarsProps = {
	gymChecks: GymCheckWithPreset[];
	cheatMeals: CheatMeal[];
};

export default function Calendars({ gymChecks, cheatMeals }: CalendarsProps) {
	const { setSelectedDayInfo, toggleDayInfoModalState } = useModalStore();

	// Create date lookup maps for efficient checking
	const {
		workoutDates,
		cheatMealDates,
		gymChecksByDate,
		cheatMealsByDate,
		workoutColorsByDate,
	} = useMemo(() => {
		const workoutDates = new Set<string>();
		const cheatMealDates = new Set<string>();
		const gymChecksByDate = new Map<string, GymCheck>();
		const cheatMealsByDate = new Map<string, CheatMeal>();
		const workoutColorsByDate = new Map<string, string[]>();

		for (const gymCheck of gymChecks) {
			const dateKey = formatDateKey(new Date(gymCheck.date));
			workoutDates.add(dateKey);

			// Store all workout colors for this date
			const colors = workoutColorsByDate.get(dateKey) || [];
			const color = gymCheck.preset?.color || "#22c55e"; // Default green if no preset
			colors.push(color);
			workoutColorsByDate.set(dateKey, colors);

			// Keep first check for modal editing (legacy behavior for now)
			if (!gymChecksByDate.has(dateKey)) {
				gymChecksByDate.set(dateKey, gymCheck);
			}
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
			workoutColorsByDate,
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
						presetId: existingGymCheck.presetId,
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

	const handleQuickToggle = async (date: Date, gymCheckId?: string) => {
		if (date > new Date()) return;

		try {
			await quickToggleWorkout({ date, gymCheckId });
			toast.success(gymCheckId ? "Workout removed" : "Quick workout added!");
		} catch (error) {
			toast.error("Failed to toggle workout");
			console.error(error);
		}
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
			gymChecksByDate={gymChecksByDate}
			workoutColorsByDate={workoutColorsByDate}
			onQuickToggle={handleQuickToggle}
		/>
	);
}
