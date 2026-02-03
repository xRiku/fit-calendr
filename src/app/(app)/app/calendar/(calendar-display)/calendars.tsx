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
		const gymChecksByDate = new Map<string, GymCheckWithPreset[]>();
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

			// Store all gym checks for this date (not just first)
			const checksForDate = gymChecksByDate.get(dateKey) || [];
			checksForDate.push(gymCheck);
			gymChecksByDate.set(dateKey, checksForDate);
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
		const existingGymChecks = gymChecksByDate.get(dateKey) || [];
		const existingCheatMeal = cheatMealsByDate.get(dateKey);

		const hasExistingData = existingGymChecks.length > 0 || existingCheatMeal;

		setSelectedDayInfo({
			date,
			gymChecks: existingGymChecks.map((gymCheck) => ({
				id: gymCheck.id,
				description: gymCheck.description,
				userId: gymCheck.userId,
				updatedAt: gymCheck.updatedAt,
				createdAt: gymCheck.createdAt,
				presetId: gymCheck.presetId,
				presetColor: gymCheck.preset?.color,
			})),
			cheatMeal: existingCheatMeal
				? {
						id: existingCheatMeal.id,
						name: existingCheatMeal.name,
						userId: existingCheatMeal.userId,
						updatedAt: existingCheatMeal.updatedAt,
						createdAt: existingCheatMeal.createdAt,
						presetId: existingCheatMeal.presetId,
					}
				: undefined,
		});

		toggleDayInfoModalState(hasExistingData ? "edit" : "create");
	};

	// Create a map for quick toggle that only needs first workout ID per date
	const quickToggleMap = useMemo(() => {
		const map = new Map<string, { id: string }>();
		for (const [dateKey, checks] of gymChecksByDate) {
			if (checks.length > 0) {
				map.set(dateKey, { id: checks[0].id });
			}
		}
		return map;
	}, [gymChecksByDate]);

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
			gymChecksByDate={quickToggleMap}
			workoutColorsByDate={workoutColorsByDate}
			onQuickToggle={handleQuickToggle}
		/>
	);
}
