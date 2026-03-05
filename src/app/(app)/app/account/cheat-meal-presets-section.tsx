"use client";

import type { CheatMealPreset } from "@/../prisma/generated/client";
import {
	createCheatMealPreset,
	deleteCheatMealPreset,
	getUserCheatMealPresets,
	updateCheatMealPreset,
} from "@/actions/preset-actions";
import { migrateExistingUserCheatMealPresets } from "@/actions/preset-migration";
import { PresetItem } from "@/components/preset-item";
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
import {
	DEFAULT_CHEAT_MEAL_PRESETS,
	PRESET_COLORS,
} from "@/lib/constants/colors";
import { Plus, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function CheatMealPresetsSection() {
	const [presets, setPresets] = useState<CheatMealPreset[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [isMigrating, setIsMigrating] = useState(false);

	const loadPresets = useCallback(async () => {
		try {
			const userPresets = await getUserCheatMealPresets();
			setPresets(userPresets);
			setLoading(false);
		} catch {
			toast.error("Falha ao carregar atalhos");
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
					toast.success(
						`Criados ${result.created} atalhos de refeições livres`,
					);
					await loadPresets();
				}
				if (mounted) {
					setIsMigrating(false);
				}
			} catch {
				// Migration errors are not critical
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
		preset: { id: string },
		newColor: string,
	) => {
		try {
			await updateCheatMealPreset({ id: preset.id, color: newColor });
			setPresets((prev) =>
				prev.map((p) => (p.id === preset.id ? { ...p, color: newColor } : p)),
			);
			toast.success("Cor atualizada");
		} catch {
			toast.error("Falha ao atualizar cor");
		}
	};

	const handleLabelSave = async (preset: { id: string }, newLabel: string) => {
		try {
			await updateCheatMealPreset({ id: preset.id, label: newLabel });
			setPresets((prev) =>
				prev.map((p) => (p.id === preset.id ? { ...p, label: newLabel } : p)),
			);
			toast.success("Rótulo atualizado");
		} catch {
			toast.error("Falha ao atualizar rótulo");
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

		const reorderedPresets = newPresets.map((p, index) => ({
			...p,
			order: index,
		}));
		setPresets(reorderedPresets);

		try {
			await Promise.all(
				reorderedPresets.map((p) =>
					updateCheatMealPreset({ id: p.id, order: p.order }),
				),
			);
		} catch {
			toast.error("Falha ao reordenar atalhos");
			loadPresets();
		}
	};

	const handleDelete = async (presetId: string) => {
		try {
			await deleteCheatMealPreset({ id: presetId });
			setPresets((prev) => prev.filter((p) => p.id !== presetId));
			toast.success("Atalho excluído");
		} catch {
			toast.error("Falha ao excluir atalho");
		}
	};

	const handleAddPreset = async () => {
		setIsCreating(true);
		try {
			const randomColor =
				PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)].value;
			const maxOrder = Math.max(...presets.map((p) => p.order), -1);
			const newPreset = await createCheatMealPreset({
				label: "Novo Atalho",
				color: randomColor,
				order: maxOrder + 1,
			});
			setPresets((prev) => [...prev, newPreset]);
			toast.success("Atalho criado");
			setIsCreating(false);
		} catch {
			toast.error("Falha ao criar atalho");
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
			toast.success("Restaurado para padrões");
		} catch {
			toast.error("Falha ao restaurar padrões");
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

			<div className="flex gap-3 pt-2">
				<Button
					onClick={handleAddPreset}
					disabled={isCreating}
					className="flex-1"
				>
					<Plus className="mr-2 h-4 w-4" />
					Adicionar Atalho
				</Button>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="outline"
							className="dark:border-neutral-700 dark:hover:bg-neutral-800"
						>
							<RotateCcw className="mr-2 h-4 w-4" />
							Restaurar Padrões
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent className="dark:border-neutral-800 dark:bg-neutral-900">
						<AlertDialogHeader>
							<AlertDialogTitle>Restaurar Padrões</AlertDialogTitle>
							<AlertDialogDescription className="dark:text-neutral-400">
								Isso excluirá todos os seus atalhos personalizados e restaurará
								as refeições livres padrão. Tem certeza?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel className="dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700">
								Cancelar
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleResetDefaults}
								className="bg-red-600 hover:bg-red-700"
							>
								Restaurar
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
