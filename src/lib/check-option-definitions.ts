import {
	getCheatMealsByYearGroupedByMonth,
	getGymChecksByYearGroupedByMonth,
	getGymStreak,
	getLastCheatMeal,
	getLastGymWorkout,
} from "@/lib/server-utils";

export const CHECK_OPTIONS = {
	workout: {
		key: "workout" as const,
		label: "Workout",
		color: "text-vibrant-green",
		bgColor: "bg-vibrant-green",
	},
	"cheat-meal": {
		key: "cheat-meal" as const,
		label: "Cheat Meal",
		color: "text-vibrant-orange",
		bgColor: "bg-vibrant-orange",
	},
};

export type CheckOptionKey = keyof typeof CHECK_OPTIONS;

export const YEARLY_CHECK_OPTIONS = {
	workout: {
		...CHECK_OPTIONS.workout,
		fetchCall: getGymChecksByYearGroupedByMonth,
	},
	"cheat-meal": {
		...CHECK_OPTIONS["cheat-meal"],
		fetchCall: getCheatMealsByYearGroupedByMonth,
	},
};

export const STREAK_CHECK_OPTIONS = {
	workout: {
		...CHECK_OPTIONS.workout,
		fetchCall: getGymStreak,
	},
};

export const LAST_CHECK_OPTIONS = {
	workout: {
		...CHECK_OPTIONS.workout,
		fetchCall: getLastGymWorkout,
	},
	"cheat-meal": {
		...CHECK_OPTIONS["cheat-meal"],
		fetchCall: getLastCheatMeal,
	},
};
