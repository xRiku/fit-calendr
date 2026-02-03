"use server";

import { auth } from "@/lib/auth";
import {
	DEFAULT_CHEAT_MEAL_PRESETS,
	DEFAULT_WORKOUT_PRESETS,
	PRESET_COLORS,
} from "@/lib/constants/colors";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

function normalizeDescription(desc: string): string {
	return desc
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s]/g, "")
		.replace(/\s+/g, " ");
}

function calculateSimilarity(str1: string, str2: string): number {
	const s1 = normalizeDescription(str1);
	const s2 = normalizeDescription(str2);

	if (s1 === s2) return 1;

	const words1 = new Set(s1.split(" "));
	const words2 = new Set(s2.split(" "));
	const intersection = new Set([...words1].filter((x) => words2.has(x)));
	const union = new Set([...words1, ...words2]);

	return intersection.size / union.size;
}

function clusterDescriptions(descriptions: string[]): string[][] {
	const clusters: string[][] = [];
	const used = new Set<string>();

	for (const desc of descriptions) {
		if (used.has(desc)) continue;

		const cluster: string[] = [desc];
		used.add(desc);

		for (const other of descriptions) {
			if (used.has(other)) continue;
			if (calculateSimilarity(desc, other) > 0.6) {
				cluster.push(other);
				used.add(other);
			}
		}

		clusters.push(cluster);
	}

	return clusters;
}

export async function migrateExistingUserPresets() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	const userId = session.user.id;

	const existingPresets = await prisma.workoutPreset.findMany({
		where: { userId },
	});

	if (existingPresets.length > 0) {
		return { success: true, message: "User already has presets", created: 0 };
	}

	const ninetyDaysAgo = new Date();
	ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

	const pastWorkouts = await prisma.gymCheck.findMany({
		where: {
			userId,
			date: { gte: ninetyDaysAgo },
			presetId: null,
		},
		select: { description: true },
	});

	const descriptionCounts = new Map<string, number>();
	for (const workout of pastWorkouts) {
		const count = descriptionCounts.get(workout.description) || 0;
		descriptionCounts.set(workout.description, count + 1);
	}

	const sortedDescriptions = Array.from(descriptionCounts.entries())
		.sort((a, b) => b[1] - a[1])
		.map(([desc]) => desc);

	const clusters = clusterDescriptions(sortedDescriptions);

	const userPresetLabels: string[] = [];
	const createdPresets = [];

	for (let i = 0; i < Math.min(clusters.length, 6); i++) {
		const cluster = clusters[i];
		const label = cluster[0];
		const normalizedLabel = normalizeDescription(label);

		const isSimilarToDefault = DEFAULT_WORKOUT_PRESETS.some(
			(preset) => calculateSimilarity(preset.label, label) > 0.5,
		);

		if (!isSimilarToDefault && !userPresetLabels.includes(normalizedLabel)) {
			userPresetLabels.push(normalizedLabel);
			const colorIndex = i % PRESET_COLORS.length;
			createdPresets.push({
				label,
				color: PRESET_COLORS[colorIndex].value,
				order: i,
			});
		}
	}

	const userLabelsLower = userPresetLabels.map((l) => l.toLowerCase());
	let defaultOrderOffset = createdPresets.length;

	for (const defaultPreset of DEFAULT_WORKOUT_PRESETS) {
		const isCovered = userLabelsLower.some(
			(userLabel) => calculateSimilarity(defaultPreset.label, userLabel) > 0.5,
		);

		if (!isCovered) {
			createdPresets.push({
				...defaultPreset,
				order: defaultOrderOffset++,
			});
		}
	}

	const presetMap = new Map<string, string>();

	for (const presetData of createdPresets) {
		const preset = await prisma.workoutPreset.create({
			data: {
				label: presetData.label,
				color: presetData.color,
				order: presetData.order,
				userId,
			},
		});
		presetMap.set(presetData.label.toLowerCase(), preset.id);
	}

	const allWorkouts = await prisma.gymCheck.findMany({
		where: { userId, presetId: null },
		select: { id: true, description: true },
	});

	for (const workout of allWorkouts) {
		for (const [presetLabel, presetId] of presetMap) {
			if (calculateSimilarity(workout.description, presetLabel) > 0.6) {
				await prisma.gymCheck.update({
					where: { id: workout.id },
					data: { presetId },
				});
				break;
			}
		}
	}

	return {
		success: true,
		message: "Presets migrated successfully",
		created: createdPresets.length,
		userPresets: userPresetLabels.length,
		defaultPresetsAdded: createdPresets.length - userPresetLabels.length,
	};
}

export async function migrateExistingUserCheatMealPresets() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	const userId = session.user.id;

	const existingPresets = await prisma.cheatMealPreset.findMany({
		where: { userId },
	});

	if (existingPresets.length > 0) {
		return {
			success: true,
			message: "User already has cheat meal presets",
			created: 0,
		};
	}

	const createdPresets = await Promise.all(
		DEFAULT_CHEAT_MEAL_PRESETS.map((preset) =>
			prisma.cheatMealPreset.create({
				data: {
					...preset,
					userId,
				},
			}),
		),
	);

	return {
		success: true,
		message: "Cheat meal presets created successfully",
		created: createdPresets.length,
	};
}
