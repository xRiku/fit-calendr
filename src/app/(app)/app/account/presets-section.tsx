"use client";

import type { WorkoutPreset } from "@/../prisma/generated/client";
import {
	createPreset,
	deletePreset,
	getUserPresets,
	updatePreset,
} from "@/actions/preset-actions";
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
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { PRESET_COLORS } from "@/lib/constants/colors";
import { ArrowDown, ArrowUp, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function PresetsSection() {
	const [presets, setPresets] = useState<WorkoutPreset[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editLabel, setEditLabel] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	const loadPresets = useCallback(async () => {
		try {
			const userPresets = await getUserPresets();
			setPresets(userPresets);
		} catch {
			toast.error("Failed to load presets");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadPresets();
	}, [loadPresets]);

	const handleColorChange = async (preset: WorkoutPreset, newColor: string) => {
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

	const handleLabelEdit = (preset: WorkoutPreset) => {
		setEditingId(preset.id);
		setEditLabel(preset.label);
	};

	const handleLabelSave = async (preset: WorkoutPreset) => {
		if (editLabel.trim() === preset.label) {
			setEditingId(null);
			return;
		}

		try {
			await updatePreset({ id: preset.id, label: editLabel.trim() });
			setPresets((prev) =>
				prev.map((p) =>
					p.id === preset.id ? { ...p, label: editLabel.trim() } : p,
				),
			);
			toast.success("Label updated");
		} catch {
			toast.error("Failed to update label");
			setEditLabel(preset.label);
		} finally {
			setEditingId(null);
		}
	};

	const handleReorder = async (
		preset: WorkoutPreset,
		direction: "up" | "down",
	) => {
		const currentIndex = presets.findIndex((p) => p.id === preset.id);
		const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

		if (newIndex < 0 || newIndex >= presets.length) return;

		const newPresets = [...presets];
		const [movedItem] = newPresets.splice(currentIndex, 1);
		newPresets.splice(newIndex, 0, movedItem);

		const reorderedPresets = newPresets.map((p, idx) => ({ ...p, order: idx }));
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
		} catch {
			toast.error("Failed to create preset");
		} finally {
			setIsCreating(false);
		}
	};

	const handleResetDefaults = async () => {
		// Delete all existing presets
		await Promise.all(presets.map((p) => deletePreset({ id: p.id })));

		// Create defaults
		const DEFAULT_PRESETS = [
			{ label: "Leg Day", color: "#ef4444" },
			{ label: "Chest Day", color: "#f97316" },
			{ label: "Back Day", color: "#3b82f6" },
			{ label: "Swimming", color: "#06b6d4" },
			{ label: "Running", color: "#22c55e" },
			{ label: "Calisthenics", color: "#a855f7" },
		];

		try {
			const newPresets = await Promise.all(
				DEFAULT_PRESETS.map((preset, index) =>
					createPreset({
						label: preset.label,
						color: preset.color,
						order: index,
					}),
				),
			);
			setPresets(newPresets);
			toast.success("Reset to defaults");
		} catch {
			toast.error("Failed to reset defaults");
		}
	};

	if (loading) {
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
			<div className="space-y-2">
				{presets.map((preset, index) => (
					<div
						key={preset.id}
						className="flex items-center gap-3 rounded-lg border border-stone-800 bg-stone-900/50 p-3 transition-colors hover:bg-stone-800/50"
					>
						<Popover>
							<PopoverTrigger asChild>
								<button
									type="button"
									className="h-6 w-6 rounded-full border-2 border-stone-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-stone-900"
									style={{ backgroundColor: preset.color }}
									aria-label={`Change color for ${preset.label}`}
								/>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-2" align="start">
								<div className="grid grid-cols-4 gap-2">
									{PRESET_COLORS.map((color) => (
										<button
											key={color.value}
											type="button"
											className="h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
											style={{ backgroundColor: color.value }}
											onClick={() => handleColorChange(preset, color.value)}
											title={color.name}
											aria-label={`Select ${color.name} color`}
										/>
									))}
								</div>
							</PopoverContent>
						</Popover>

						{editingId === preset.id ? (
							<Input
								value={editLabel}
								onChange={(e) => setEditLabel(e.target.value)}
								onBlur={() => handleLabelSave(preset)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleLabelSave(preset);
									}
									if (e.key === "Escape") {
										setEditingId(null);
										setEditLabel(preset.label);
									}
								}}
								autoFocus
								className="flex-1 bg-stone-800 border-stone-700"
							/>
						) : (
							<button
								type="button"
								onClick={() => handleLabelEdit(preset)}
								className="flex-1 text-left text-sm font-medium text-stone-200 hover:text-stone-100 transition-colors focus:outline-none"
							>
								{preset.label}
							</button>
						)}

						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 text-stone-500 hover:text-stone-300"
								onClick={() => handleReorder(preset, "up")}
								disabled={index === 0}
								aria-label="Move up"
							>
								<ArrowUp className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 text-stone-500 hover:text-stone-300"
								onClick={() => handleReorder(preset, "down")}
								disabled={index === presets.length - 1}
								aria-label="Move down"
							>
								<ArrowDown className="h-4 w-4" />
							</Button>
						</div>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7 text-stone-500 hover:text-red-400"
									aria-label="Delete preset"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent className="dark:border-stone-800 dark:bg-stone-900">
								<AlertDialogHeader>
									<AlertDialogTitle>Delete Preset</AlertDialogTitle>
									<AlertDialogDescription className="dark:text-stone-400">
										Are you sure you want to delete &quot;{preset.label}&quot;?
										This action cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel className="dark:border-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700">
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => handleDelete(preset.id)}
										className="bg-red-600 hover:bg-red-700"
									>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				))}
			</div>

			<div className="flex gap-3 pt-2">
				<Button
					onClick={handleAddPreset}
					disabled={isCreating}
					className="flex-1"
				>
					<Plus className="mr-2 h-4 w-4" />
					Add Preset
				</Button>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="outline"
							className="dark:border-stone-700 dark:hover:bg-stone-800"
						>
							<RotateCcw className="mr-2 h-4 w-4" />
							Reset to Defaults
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent className="dark:border-stone-800 dark:bg-stone-900">
						<AlertDialogHeader>
							<AlertDialogTitle>Reset to Defaults</AlertDialogTitle>
							<AlertDialogDescription className="dark:text-stone-400">
								This will delete all your custom presets and restore the default
								workouts. Are you sure?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel className="dark:border-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700">
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleResetDefaults}
								className="bg-red-600 hover:bg-red-700"
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
