"use client";

import type { CheatMealPreset } from "@/../prisma/generated/client";
import {
	createCheatMealPreset,
	deleteCheatMealPreset,
	getUserCheatMealPresets,
	updateCheatMealPreset,
} from "@/actions/preset-actions";
import { migrateExistingUserCheatMealPresets } from "@/actions/preset-migration";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
	DEFAULT_CHEAT_MEAL_PRESETS,
	PRESET_COLORS,
} from "@/lib/constants/colors";
import { ArrowDown, ArrowUp, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function CheatMealPresetsSection() {
	const [presets, setPresets] = useState<CheatMealPreset[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editLabel, setEditLabel] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [isMigrating, setIsMigrating] = useState(false);

	const loadPresets = useCallback(async () => {
		try {
			const userPresets = await getUserCheatMealPresets();
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

	useEffect(() => {
		let mounted = true;

		const runMigration = async () => {
			setIsMigrating(true);
			try {
				const result = await migrateExistingUserCheatMealPresets();
				if (mounted && result.created > 0) {
					toast.success(`Created ${result.created} cheat meal presets`);
					await loadPresets();
				}
			} catch {
				// Migration errors are not critical
			} finally {
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

	const handleColorChange = async (
		preset: CheatMealPreset,
		newColor: string,
	) => {
		try {
			await updateCheatMealPreset({ id: preset.id, color: newColor });
			setPresets((prev) =>
				prev.map((p) => (p.id === preset.id ? { ...p, color: newColor } : p)),
			);
			toast.success("Color updated");
		} catch {
			toast.error("Failed to update color");
		}
	};

	const handleLabelEdit = (preset: CheatMealPreset) => {
		setEditingId(preset.id);
		setEditLabel(preset.label);
	};

	const handleLabelSave = async (preset: CheatMealPreset) => {
		if (editLabel.trim() === preset.label) {
			setEditingId(null);
			return;
		}

		try {
			await updateCheatMealPreset({ id: preset.id, label: editLabel.trim() });
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
		preset: CheatMealPreset,
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
				reorderedPresets.map((p) =>
					updateCheatMealPreset({ id: p.id, order: p.order }),
				),
			);
		} catch {
			toast.error("Failed to reorder presets");
			loadPresets();
		}
	};

	const handleDelete = async (presetId: string) => {
		try {
			await deleteCheatMealPreset({ id: presetId });
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
			const newPreset = await createCheatMealPreset({
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
		await Promise.all(presets.map((p) => deleteCheatMealPreset({ id: p.id })));

		try {
			const newPresets = await Promise.all(
				DEFAULT_CHEAT_MEAL_PRESETS.map((preset) =>
					createCheatMealPreset({
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
			<div>
				{presets.map((preset, index) => (
					<div key={preset.id}>
						{/* Mobile: Flat with separators | Desktop: Card style */}
						<div className="flex items-center gap-3 py-3 md:rounded-lg md:border md:border-neutral-800 md:bg-neutral-900/50 md:p-3 md:transition-colors md:hover:bg-neutral-800/50">
							<Popover>
								<PopoverTrigger asChild>
									<button
										type="button"
										className="h-6 w-6 rounded-full border-2 border-neutral-700 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
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
												className="h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
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
									className="flex-1 bg-neutral-800 border-neutral-700"
								/>
							) : (
								<button
									type="button"
									onClick={() => handleLabelEdit(preset)}
									className="flex-1 text-left text-sm font-medium text-neutral-200 hover:text-neutral-100 transition-colors focus:outline-none"
								>
									{preset.label}
								</button>
							)}

							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7 text-neutral-500 hover:text-neutral-300"
									onClick={() => handleReorder(preset, "up")}
									disabled={index === 0}
									aria-label="Move up"
								>
									<ArrowUp className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7 text-neutral-500 hover:text-neutral-300"
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
										className="h-7 w-7 text-neutral-500 hover:text-red-400"
										aria-label="Delete preset"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent className="dark:border-neutral-800 dark:bg-neutral-900">
									<AlertDialogHeader>
										<AlertDialogTitle>Delete Preset</AlertDialogTitle>
										<AlertDialogDescription className="dark:text-neutral-400">
											Are you sure you want to delete &quot;{preset.label}
											&quot;? This action cannot be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel className="dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
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
						{/* Horizontal separator between items on mobile, hidden on last item */}
						{index < presets.length - 1 && <Separator className="md:hidden" />}
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
							className="dark:border-neutral-700 dark:hover:bg-neutral-800"
						>
							<RotateCcw className="mr-2 h-4 w-4" />
							Reset to Defaults
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent className="dark:border-neutral-800 dark:bg-neutral-900">
						<AlertDialogHeader>
							<AlertDialogTitle>Reset to Defaults</AlertDialogTitle>
							<AlertDialogDescription className="dark:text-neutral-400">
								This will delete all your custom presets and restore the default
								cheat meals. Are you sure?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel className="dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
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
