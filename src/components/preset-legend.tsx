"use client";

import { useState } from "react";

const VISIBLE_COUNT = 4;

type Preset = { id: string; label: string; color: string };

function PresetGroup({ label, presets }: { label: string; presets: Preset[] }) {
	const hasMore = presets.length > VISIBLE_COUNT;
	const [expanded, setExpanded] = useState(false);
	const visible = expanded ? presets : presets.slice(0, VISIBLE_COUNT);
	const hiddenCount = presets.length - VISIBLE_COUNT;

	if (presets.length === 0) return null;

	return (
		<div className="space-y-1.5">
			<span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground/70 font-medium">
				{label}
			</span>
			{visible.map((preset) => (
				<div key={preset.id} className="flex items-center gap-2">
					<span
						className="size-2.5 rounded-full shrink-0"
						style={{ backgroundColor: preset.color }}
					/>
					<span className="text-xs text-muted-foreground truncate">
						{preset.label}
					</span>
				</div>
			))}
			{hasMore && (
				<button
					type="button"
					onClick={() => setExpanded(!expanded)}
					className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
				>
					{expanded ? "Show less" : `+${hiddenCount} more`}
				</button>
			)}
		</div>
	);
}

export default function PresetLegend({
	workoutPresets,
	cheatMealPresets,
}: {
	workoutPresets: Preset[];
	cheatMealPresets: Preset[];
}) {
	return (
		<div className="space-y-3">
			<PresetGroup label="Activities" presets={workoutPresets} />
			<PresetGroup label="Cheat Meals" presets={cheatMealPresets} />
		</div>
	);
}
