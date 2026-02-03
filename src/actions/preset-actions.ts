"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

// Color palette for presets
const PRESET_COLORS = [
	{ name: "Cyan", value: "#06b6d4" },
	{ name: "Green", value: "#22c55e" },
	{ name: "Red", value: "#ef4444" },
	{ name: "Orange", value: "#f97316" },
	{ name: "Blue", value: "#3b82f6" },
	{ name: "Purple", value: "#a855f7" },
	{ name: "Gold", value: "#eab308" },
	{ name: "Pink", value: "#ec4899" },
];

// Default presets for new users
const DEFAULT_PRESETS = [
	{ label: "Leg Day", color: "#ef4444", order: 0 },
	{ label: "Chest Day", color: "#f97316", order: 1 },
	{ label: "Back Day", color: "#3b82f6", order: 2 },
	{ label: "Swimming", color: "#06b6d4", order: 3 },
	{ label: "Running", color: "#22c55e", order: 4 },
	{ label: "Calisthenics", color: "#a855f7", order: 5 },
];

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

	// Get current preset to check if label changed
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

	// If label changed and cascade is true, update all linked workouts
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

	// Unlink preset from all workouts before deleting
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

	const count = await prisma.gymCheck.count({
		where: { presetId },
	});

	return count;
}
