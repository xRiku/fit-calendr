"use client";

import type { WorkoutPreset } from "@/../prisma/generated/client";
import {
	createPreset,
	deletePreset,
	getUserPresets,
	updatePreset,
} from "@/actions/preset-actions";
import { migrateExistingUserPresets } from "@/actions/preset-migration";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PresetItem } from "@/components/preset-item";
import { DEFAULT_WORKOUT_PRESETS, PRESET_COLORS } from "@/lib/constants/colors";
import { Plus, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function WorkoutPresetsSection() {
	const [presets, setPresets] = useState<WorkoutPreset[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [isMigrating, setIsMigrating] = useState(false);

	const loadPresets = useCallback(async () => {
		try {
			const userPresets = await getUserPresets();
			setPresets(userPresets);
			setLoading(false);
		} catch {
			toast.error("Failed to load presets");
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadPresets();
	}, [loadPresets]);

	useEffect(() => {
		let mounted = true;

		const runMigration = async () => {
			setIsMigrating(true);
			try {
				const result = await migrateExistingUserPresets();
				if (mounted && result.created > 0) {
					toast.success(
						`Created ${result.created} presets from your workout history`,
					);
					await loadPresets();
				}
				if (mounted) {
					setIsMigrating(false);
				}
			} catch {
				// Migration errors are not critical, silently fail
				if (mounted) {
					setIsMigrating(false);
				}
			}
		};

		runMigration();

		return () => {
			mounted = false;
		};
	}, [loadPresets]);

	const handleColorChange = async (preset: { id: string }, newColor: string) => {
		try {
			await updatePreset({ id: preset.id, color: newColor });
			setPresets((prev) =>
				prev.map((p) => (p.id === preset.id ? { ...p, color: newColor } : p)),
			);
			toast.success("Color updated");
		} catch {
			toast.error("Failed to update color");
		}
	};

	const handleLabelSave = async (preset: { id: string }, newLabel: string) => {
		try {
			await updatePreset({ id: preset.id, label: newLabel });
			setPresets((prev) =>
				prev.map((p) =>
					p.id === preset.id ? { ...p, label: newLabel } : p,
				),
			);
			toast.success("Label updated");
		} catch {
			toast.error("Failed to update label");
		}
	};

	const handleReorder = async (
		preset: { id: string },
		direction: "up" | "down",
	) => {
		const currentIndex = presets.findIndex((p) => p.id === preset.id);
		const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

		if (newIndex < 0 || newIndex >= presets.length) return;

		const newPresets = [...presets];
		const [movedItem] = newPresets.splice(currentIndex, 1);
		newPresets.splice(newIndex, 0, movedItem);

		const reorderedPresets = newPresets.map((p, index) => ({ ...p, order: index }));
		setPresets(reorderedPresets);

		try {
			await Promise.all(
				reorderedPresets.map((p) => updatePreset({ id: p.id, order: p.order })),
			);
		} catch {
			toast.error("Failed to reorder presets");
			loadPresets();
		}
	};

	const handleDelete = async (presetId: string) => {
		try {
			await deletePreset({ id: presetId });
			setPresets((prev) => prev.filter((p) => p.id !== presetId));
			toast.success("Preset deleted");
		} catch {
			toast.error("Failed to delete preset");
		}
	};

	const handleAddPreset = async () => {
		setIsCreating(true);
		try {
			const randomColor =
				PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)].value;
			const maxOrder = Math.max(...presets.map((p) => p.order), -1);
			const newPreset = await createPreset({
				label: "New Preset",
				color: randomColor,
				order: maxOrder + 1,
			});
			setPresets((prev) => [...prev, newPreset]);
			toast.success("Preset created");
			setIsCreating(false);
		} catch {
			toast.error("Failed to create preset");
			setIsCreating(false);
		}
	};

	const handleResetDefaults = async () => {
		await Promise.all(presets.map((p) => deletePreset({ id: p.id })));

		try {
			const newPresets = await Promise.all(
				DEFAULT_WORKOUT_PRESETS.map((preset) =>
					createPreset({
						label: preset.label,
						color: preset.color,
						order: preset.order,
					}),
				),
			);
			setPresets(newPresets);
			toast.success("Reset to defaults");
		} catch {
			toast.error("Failed to reset defaults");
		}
	};

	if (loading || isMigrating) {
		return (
			<div className="w-full space-y-3">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
			</div>
		);
	}

	return (
		<div className="w-full space-y-4">
			<div className="flex flex-col gap-2">
				{presets.map((preset, index) => (
					<PresetItem
						key={preset.id}
						preset={preset}
						isFirst={index === 0}
						isLast={index === presets.length - 1}
						onColorChange={handleColorChange}
						onLabelSave={handleLabelSave}
						onReorder={handleReorder}
						onDelete={handleDelete}
					/>
				))}
			</div>

			<div className="flex gap-3 pt-4">
				<Button
					onClick={handleAddPreset}
					disabled={isCreating}
					className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all"
				>
					<Plus className="mr-2 h-4 w-4" />
					Add Preset
				</Button>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="outline"
							className="border-white/10 hover:bg-white/5"
						>
							<RotateCcw className="mr-2 h-4 w-4" />
							Reset Defaults
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent className="border-white/10 bg-background/95 backdrop-blur-xl">
						<AlertDialogHeader>
							<AlertDialogTitle>Reset to Defaults</AlertDialogTitle>
							<AlertDialogDescription className="text-white/60">
								This will delete all your custom presets and restore the default
								workouts. Are you sure?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel className="border-white/10 bg-white/5 hover:bg-white/10 text-white">
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleResetDefaults}
								className="bg-destructive hover:bg-destructive/90 text-white"
							>
								Reset
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
