"use server-only";

import type {
	CheatMealModel,
	GymCheckModel,
} from "@/../prisma/generated/models";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./auth";
import prisma from "./db";

type HasDate = { date: Date };

function groupByMonth<T extends HasDate>(
	items: T[],
): {
	hashTable: { [key: number]: T[] };
	count: number;
} {
	const hashTable: { [key: number]: T[] } = {};
	for (const item of items) {
		const date = new Date(item.date);
		const month = date.getUTCMonth();
		if (!hashTable[month]) {
			hashTable[month] = [item];
			continue;
		}
		hashTable[month].push(item);
	}
	return { hashTable, count: items.length };
}

export const getCheatMealsByYearGroupedByMonth = cache(
	async (params?: { year?: number }) => {
		const { year = new Date().getFullYear() } = params || {};
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) redirect("/auth/sign-in");

		const startDate = new Date(year, 0, 1);
		const endDate = new Date(year, 11, 31, 23, 59, 59);

		const data = await prisma.cheatMeal.findMany({
			where: {
				userId: session.user.id,
				date: { gte: startDate, lte: endDate },
			},
		});

		return groupByMonth<CheatMealModel>(data);
	},
);

export const getGymChecksByYearGroupedByMonth = cache(
	async (params?: { year?: number }) => {
		const { year = new Date().getFullYear() } = params || {};
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) redirect("/auth/sign-in");

		const startDate = new Date(year, 0, 1);
		const endDate = new Date(year, 11, 31, 23, 59, 59);

		const data = await prisma.gymCheck.findMany({
			where: {
				userId: session.user.id,
				date: { gte: startDate, lte: endDate },
			},
		});

		return groupByMonth<GymCheckModel>(data);
	},
);

export const getLastCheatMeal = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}
	const data = await prisma.cheatMeal.findMany({
		where: {
			userId: session.user.id,
			date: {
				lte: new Date(),
			},
		},
		orderBy: {
			date: "desc",
		},
		take: 1,
	});

	return data;
});

export const getLastGymWorkout = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}
	const data = await prisma.gymCheck.findMany({
		where: {
			userId: session.user.id,
			date: {
				lte: new Date(),
			},
		},
		orderBy: {
			date: "desc",
		},
		take: 1,
	});

	return data;
});

export const getAvailableYears = cache(async (): Promise<number[]> => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	const [gymChecks, cheatMeals] = await Promise.all([
		prisma.gymCheck.findMany({
			where: { userId: session.user.id },
			select: { date: true },
		}),
		prisma.cheatMeal.findMany({
			where: { userId: session.user.id },
			select: { date: true },
		}),
	]);

	const yearsSet = new Set<number>();
	const currentYear = new Date().getFullYear();
	yearsSet.add(currentYear);

	for (const check of gymChecks) {
		yearsSet.add(new Date(check.date).getFullYear());
	}

	for (const meal of cheatMeals) {
		yearsSet.add(new Date(meal.date).getFullYear());
	}

	return Array.from(yearsSet).sort((a, b) => b - a);
});

function calculateStreak(dates: Date[]): {
	currentStreak: number;
	longestStreak: number;
} {
	if (dates.length === 0) {
		return { currentStreak: 0, longestStreak: 0 };
	}

	// Sort dates ascending (oldest first)
	const sortedDates = dates
		.map((d) => new Date(d))
		.sort((a, b) => a.getTime() - b.getTime());

	// Normalize dates to midnight for comparison
	const normalizeDate = (date: Date) => {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		return d.getTime();
	};

	const today = normalizeDate(new Date());

	// Calculate longest streak
	let longestStreak = 1;
	let currentLongestRun = 1;

	for (let i = 1; i < sortedDates.length; i++) {
		const prevDate = normalizeDate(sortedDates[i - 1]);
		const currDate = normalizeDate(sortedDates[i]);
		const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

		if (diffDays === 1) {
			currentLongestRun++;
			longestStreak = Math.max(longestStreak, currentLongestRun);
		} else if (diffDays > 1) {
			currentLongestRun = 1;
		}
	}

	// Calculate current streak (from today backwards)
	let currentStreak = 0;
	const hasEntryToday = sortedDates.some((d) => normalizeDate(d) === today);

	if (hasEntryToday) {
		currentStreak = 1;
		for (let i = sortedDates.length - 2; i >= 0; i--) {
			const currDate = normalizeDate(sortedDates[i + 1]);
			const prevDate = normalizeDate(sortedDates[i]);
			const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

			if (diffDays === 1) {
				currentStreak++;
			} else {
				break;
			}
		}
	} else {
		// Check if yesterday has entry (streak continues but not yet logged today)
		const yesterday = today - 24 * 60 * 60 * 1000;
		const hasEntryYesterday = sortedDates.some(
			(d) => normalizeDate(d) === yesterday,
		);

		if (hasEntryYesterday) {
			currentStreak = 1;
			for (let i = sortedDates.length - 2; i >= 0; i--) {
				const currDate = normalizeDate(sortedDates[i + 1]);
				const prevDate = normalizeDate(sortedDates[i]);
				const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

				if (diffDays === 1) {
					currentStreak++;
				} else {
					break;
				}
			}
		}
	}

	return { currentStreak, longestStreak };
}

export const getUserGoals = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	const user = await prisma.user.findUniqueOrThrow({
		where: { id: session.user.id },
		select: { weeklyWorkoutGoal: true, weeklyCheatMealBudget: true },
	});

	return user;
});

export const getWeeklyProgress = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	// Get Monday of current week
	const now = new Date();
	const day = now.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	const monday = new Date(now);
	monday.setDate(now.getDate() + diff);
	monday.setHours(0, 0, 0, 0);

	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);
	sunday.setHours(23, 59, 59, 999);

	const [workouts, cheatMeals, user] = await Promise.all([
		prisma.gymCheck.count({
			where: {
				userId: session.user.id,
				date: { gte: monday, lte: sunday },
			},
		}),
		prisma.cheatMeal.count({
			where: {
				userId: session.user.id,
				date: { gte: monday, lte: sunday },
			},
		}),
		prisma.user.findUniqueOrThrow({
			where: { id: session.user.id },
			select: { weeklyWorkoutGoal: true, weeklyCheatMealBudget: true },
		}),
	]);

	return {
		workouts,
		cheatMeals,
		weeklyWorkoutGoal: user.weeklyWorkoutGoal,
		weeklyCheatMealBudget: user.weeklyCheatMealBudget,
	};
});

export const getGymStreak = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	const gymChecks = await prisma.gymCheck.findMany({
		where: {
			userId: session.user.id,
		},
		select: { date: true },
		orderBy: { date: "asc" },
	});

	const dates = gymChecks.map((g) => g.date);
	return calculateStreak(dates);
});
