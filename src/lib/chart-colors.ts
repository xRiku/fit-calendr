/**
 * Chart Colors Documentation
 *
 * The application uses two color scales for data visualization:
 * 1. Workout chart colors (based on vibrant-green)
 * 2. Cheat meal chart colors (based on vibrant-orange)
 *
 * Each scale provides 7 distinct colors with consistent hue but varying lightness,
 * ensuring they are distinguishable for users with color vision deficiencies.
 *
 * Usage:
 * - For workout data: use `var(--color-chart-[1-7]-workout)`
 * - For cheat meal data: use `var(--color-chart-[1-7]-cheatmeal)`
 *
 * The colors are designed to maintain consistent branding while providing enough
 * visual differentiation for data visualization.
 */

// Helper to get the correct chart color based on data type and index
export function getChartColor(
	dataType: "workout" | "cheatmeal",
	index: number,
): string {
	// Ensure index is within range 1-7
	const safeIndex = ((index - 1) % 7) + 1;
	return `var(--color-chart-${safeIndex}-${dataType})`;
}

// Type definitions
export type ChartColorType = "workout" | "cheatmeal";

// Color metadata for reference
export const COLOR_METADATA = {
	workout: {
		baseColor: "var(--vibrant-green)",
		hue: 152.8,
		description: "Green scale based on vibrant-green",
	},
	cheatmeal: {
		baseColor: "var(--vibrant-orange)",
		hue: 64.01,
		description: "Orange scale based on vibrant-orange",
	},
};
