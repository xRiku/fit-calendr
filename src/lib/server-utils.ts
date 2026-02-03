"use server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./auth";
import prisma from "./db";

export const getCheatMealsByYearGroupedByMonth = cache(
	async (params?: {
		year?: number;
	}): Promise<{
		hashTable: { [key: string]: typeof data };
		count: number;
	}> => {
		const { year = new Date().getFullYear() } = params || {};

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
					lte: new Date(year, 11, 31),
					gte: new Date(year, 0, 1),
				},
			},
		});

		const hashTable: { [key: number]: typeof data } = {};
		for (const item of data) {
			const date = new Date(item.date);
			const month = date.getUTCMonth();
			if (!hashTable[month]) {
				hashTable[month] = [item];
				continue;
			}

			hashTable[month].push(item);
		}

		return { hashTable, count: data.length };
	},
);

export const getGymChecksByYearGroupedByMonth = cache(
	async (params?: {
		year?: number;
	}): Promise<{
		hashTable: { [key: string]: typeof data };
		count: number;
	}> => {
		const { year = new Date().getFullYear() } = params || {};
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
					lte: new Date(year ?? new Date().getFullYear(), 11, 31),
					gte: new Date(year ?? new Date().getFullYear(), 0, 1),
				},
			},
		});

		const hashTable: { [key: number]: typeof data } = {};
		for (const item of data) {
			const date = new Date(item.date);
			const month = date.getUTCMonth();
			if (!hashTable[month]) {
				hashTable[month] = [item];
				continue;
			}

			hashTable[month].push(item);
		}

		return { hashTable, count: data.length };
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
