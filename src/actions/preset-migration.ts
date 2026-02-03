"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Color palette for presets
const PRESET_COLORS = [
	"#ef4444", // Red (Leg Day)
	"#f97316", // Orange (Chest Day)
	"#3b82f6", // Blue (Back Day)
	"#06b6d4", // Cyan (Swimming)
	"#22c55e", // Green (Running)
	"#a855f7", // Purple (Calisthenics)
	"#eab308", // Gold
	"#ec4899", // Pink
];

const DEFAULT_PRESETS = [
	{ label: "Leg Day", color: "#ef4444", order: 0 },
	{ label: "Chest Day", color: "#f97316", order: 1 },
	{ label: "Back Day", color: "#3b82f6", order: 2 },
	{ label: "Swimming", color: "#06b6d4", order: 3 },
	{ label: "Running", color: "#22c55e", order: 4 },
	{ label: "Calisthenics", color: "#a855f7", order: 5 },
];

// Normalize workout description for clustering
function normalizeDescription(desc: string): string {
	return desc
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s]/g, "") // Remove special chars
		.replace(/\s+/g, " "); // Normalize spaces
}

// Calculate similarity between two strings (0-1)
function calculateSimilarity(str1: string, str2: string): number {
	const s1 = normalizeDescription(str1);
	const s2 = normalizeDescription(str2);

	if (s1 === s2) return 1;

	// Simple word overlap similarity
	const words1 = new Set(s1.split(" "));
	const words2 = new Set(s2.split(" "));
	const intersection = new Set([...words1].filter((x) => words2.has(x)));
	const union = new Set([...words1, ...words2]);

	return intersection.size / union.size;
}

// Cluster similar descriptions
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

	// Check if user already has presets
	const existingPresets = await prisma.workoutPreset.findMany({
		where: { userId },
	});

	if (existingPresets.length > 0) {
		return { success: true, message: "User already has presets", created: 0 };
	}

	// Get past 90 days of workouts
	const ninetyDaysAgo = new Date();
	ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

	const pastWorkouts = await prisma.gymCheck.findMany({
		where: {
			userId,
			date: { gte: ninetyDaysAgo },
			presetId: null, // Only workouts without presets
		},
		select: { description: true },
	});

	// Count frequency of each description
	const descriptionCounts = new Map<string, number>();
	for (const workout of pastWorkouts) {
		const count = descriptionCounts.get(workout.description) || 0;
		descriptionCounts.set(workout.description, count + 1);
	}

	// Convert to array and sort by frequency
	const sortedDescriptions = Array.from(descriptionCounts.entries())
		.sort((a, b) => b[1] - a[1])
		.map(([desc]) => desc);

	// Cluster similar descriptions
	const clusters = clusterDescriptions(sortedDescriptions);

	// Create presets from top clusters (up to 6 from history, leave room for defaults)
	const userPresetLabels: string[] = [];
	const createdPresets = [];

	for (let i = 0; i < Math.min(clusters.length, 6); i++) {
		const cluster = clusters[i];
		// Use most frequent variation as the label
		const label = cluster[0];
		const normalizedLabel = normalizeDescription(label);

		// Skip if it's too similar to a default preset
		const isSimilarToDefault = DEFAULT_PRESETS.some(
			(preset) => calculateSimilarity(preset.label, label) > 0.5,
		);

		if (!isSimilarToDefault && !userPresetLabels.includes(normalizedLabel)) {
			userPresetLabels.push(normalizedLabel);
			// Assign color based on position
			const colorIndex = i % PRESET_COLORS.length;
			createdPresets.push({
				label,
				color: PRESET_COLORS[colorIndex],
				order: i,
			});
		}
	}

	// Add default presets that aren't covered by user presets
	const userLabelsLower = userPresetLabels.map((l) => l.toLowerCase());
	let defaultOrderOffset = createdPresets.length;

	for (const defaultPreset of DEFAULT_PRESETS) {
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

	// Create all presets in database
	const presetMap = new Map<string, string>(); // label -> presetId

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

	// Link existing workouts to their new presets
	const allWorkouts = await prisma.gymCheck.findMany({
		where: { userId, presetId: null },
		select: { id: true, description: true },
	});

	for (const workout of allWorkouts) {
		const normalizedDesc = normalizeDescription(workout.description);

		// Find matching preset
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
