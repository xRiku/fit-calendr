type HasDate = { date: Date };

/**
 * Transforms grouped-by-month data into a Map of date string → count
 * for use in the yearly heatmap.
 */
export function buildHeatmapData(hashTable: {
	[key: number]: HasDate[];
}): Map<string, number> {
	const map = new Map<string, number>();

	for (const items of Object.values(hashTable)) {
		for (const item of items) {
			const d = new Date(item.date);
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
			map.set(key, (map.get(key) ?? 0) + 1);
		}
	}

	return map;
}
