"use client";

import { useMemo } from "react";

// Deterministic pseudo-random number generator for consistent renders
function seededRandom(seed: number): number {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

export function HeatmapPreview() {
	// Generate deterministic data once
	const heatmapData = useMemo(() => {
		return Array.from({ length: 144 }, (_, i) => {
			const intensity = seededRandom(i * 997); // Use prime number for better distribution
			if (intensity > 0.7) return "bg-vibrant-green";
			if (intensity > 0.4) return "bg-vibrant-green/60";
			if (intensity > 0.2) return "bg-vibrant-green/30";
			return "bg-neutral-800";
		});
	}, []);

	return (
		<div className="grid grid-cols-12 gap-1">
			{heatmapData.map((bgClass, i) => (
				<div
					key={`heatmap-${bgClass}-${i}`}
					className={`aspect-square rounded-sm ${bgClass}`}
				/>
			))}
		</div>
	);
}
