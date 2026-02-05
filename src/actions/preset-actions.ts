"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

// --- Workout Preset Actions ---

export const getUserPresets = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	const presets = await prisma.workoutPreset.findMany({
		where: { userId: session.user.id },
		orderBy: { order: "asc" },
	});

	return presets;
});

export async function createPreset({
	label,
	color,
	order,
}: {
	label: string;
	color: string;
	order: number;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	const preset = await prisma.workoutPreset.create({
		data: {
			label,
			color,
			order,
			userId: session.user.id,
		},
	});

	revalidatePath("/app/account", "page");
	return preset;
}

export async function updatePreset({
	id,
	label,
	color,
	order,
	cascade = false,
}: {
	id: string;
	label?: string;
	color?: string;
	order?: number;
	cascade?: boolean;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	const currentPreset = await prisma.workoutPreset.findFirst({
		where: { id, userId: session.user.id },
		include: {
			_count: {
				select: { gymChecks: true },
			},
		},
	});

	if (!currentPreset) {
		throw new Error("Preset not found");
	}

	if (cascade && label && label !== currentPreset.label) {
		await prisma.gymCheck.updateMany({
			where: { presetId: id },
			data: { description: label },
		});
	}

	const preset = await prisma.workoutPreset.update({
		where: { id },
		data: {
			...(label && { label }),
			...(color && { color }),
			...(order !== undefined && { order }),
		},
	});

	revalidatePath("/app/account", "page");
	revalidatePath("/app/calendar", "page");
	return preset;
}

export async function deletePreset({ id }: { id: string }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	await prisma.gymCheck.updateMany({
		where: { presetId: id },
		data: { presetId: null },
	});

	await prisma.workoutPreset.delete({
		where: { id },
	});

	revalidatePath("/app/account", "page");
	revalidatePath("/app/calendar", "page");
}

export async function createWorkoutWithPresets({
	date,
	workouts,
}: {
	date: Date;
	workouts: { presetId?: string; description: string }[];
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	const createdWorkouts = await Promise.all(
		workouts.map((workout) =>
			prisma.gymCheck.create({
				data: {
					description: workout.description,
					date,
					userId: session.user.id,
					...(workout.presetId && { presetId: workout.presetId }),
				},
			}),
		),
	);

	revalidatePath("/app/calendar", "page");
	return createdWorkouts;
}

export async function getPresetUsageCount(presetId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	return prisma.gymCheck.count({ where: { presetId } });
}

// --- Cheat Meal Preset Actions ---

export const getUserCheatMealPresets = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	const presets = await prisma.cheatMealPreset.findMany({
		where: { userId: session.user.id },
		orderBy: { order: "asc" },
	});

	return presets;
});

export async function createCheatMealPreset({
	label,
	color,
	order,
}: {
	label: string;
	color: string;
	order: number;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	const preset = await prisma.cheatMealPreset.create({
		data: {
			label,
			color,
			order,
			userId: session.user.id,
		},
	});

	revalidatePath("/app/account", "page");
	return preset;
}

export async function updateCheatMealPreset({
	id,
	label,
	color,
	order,
	cascade = false,
}: {
	id: string;
	label?: string;
	color?: string;
	order?: number;
	cascade?: boolean;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	const currentPreset = await prisma.cheatMealPreset.findFirst({
		where: { id, userId: session.user.id },
		include: {
			_count: {
				select: { cheatMeals: true },
			},
		},
	});

	if (!currentPreset) {
		throw new Error("Preset not found");
	}

	if (cascade && label && label !== currentPreset.label) {
		await prisma.cheatMeal.updateMany({
			where: { presetId: id },
			data: { name: label },
		});
	}

	const preset = await prisma.cheatMealPreset.update({
		where: { id },
		data: {
			...(label && { label }),
			...(color && { color }),
			...(order !== undefined && { order }),
		},
	});

	revalidatePath("/app/account", "page");
	revalidatePath("/app/calendar", "page");
	return preset;
}

export async function deleteCheatMealPreset({ id }: { id: string }) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	await prisma.cheatMeal.updateMany({
		where: { presetId: id },
		data: { presetId: null },
	});

	await prisma.cheatMealPreset.delete({
		where: { id },
	});

	revalidatePath("/app/account", "page");
	revalidatePath("/app/calendar", "page");
}

export async function createCheatMealWithPresets({
	date,
	cheatMeals,
}: {
	date: Date;
	cheatMeals: { presetId?: string; name: string }[];
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	const created = await Promise.all(
		cheatMeals.map((meal) =>
			prisma.cheatMeal.create({
				data: {
					name: meal.name,
					date,
					userId: session.user.id,
					...(meal.presetId && { presetId: meal.presetId }),
				},
			}),
		),
	);

	revalidatePath("/app/calendar", "page");
	return created;
}

export async function getCheatMealPresetUsageCount(presetId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Unauthorized");
	}

	return prisma.cheatMeal.count({ where: { presetId } });
}
