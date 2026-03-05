"use client";

import { updateUserGoals } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dumbbell, Minus, Plus, Utensils } from "lucide-react";
import { useState, useTransition } from "react";
import { useWebHaptics } from "web-haptics/react";

export function GoalsSection({
	initialWorkoutGoal,
	initialCheatMealBudget,
}: {
	initialWorkoutGoal: number;
	initialCheatMealBudget: number;
}) {
	const [isPending, startTransition] = useTransition();
	const haptic = useWebHaptics();
	const [workoutGoal, setWorkoutGoal] = useState(() => initialWorkoutGoal);
	const [cheatMealBudget, setCheatMealBudget] = useState(
		() => initialCheatMealBudget,
	);
	const [saved, setSaved] = useState(false);

	const hasChanges =
		workoutGoal !== initialWorkoutGoal ||
		cheatMealBudget !== initialCheatMealBudget;

	function handleSave() {
		startTransition(async () => {
			await updateUserGoals({
				weeklyWorkoutGoal: workoutGoal,
				weeklyCheatMealBudget: cheatMealBudget,
			});
			haptic.trigger("success");
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		});
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<Label className="flex items-center gap-2 text-sm">
					<Dumbbell className="size-4 text-vibrant-green" />
					Meta semanal de treinos
				</Label>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						type="button"
						onClick={() => setWorkoutGoal((v) => Math.max(1, v - 1))}
						disabled={workoutGoal <= 1}
						className="size-9 shrink-0"
					>
						<Minus className="size-4" />
					</Button>
					<span className="w-8 text-center font-medium tabular-nums text-sm">
						{workoutGoal}
					</span>
					<Button
						variant="outline"
						size="icon"
						type="button"
						onClick={() => setWorkoutGoal((v) => Math.min(7, v + 1))}
						disabled={workoutGoal >= 7}
						className="size-9 shrink-0"
					>
						<Plus className="size-4" />
					</Button>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<Label className="flex items-center gap-2 text-sm">
					<Utensils className="size-4 text-vibrant-orange" />
					Orçamento semanal de refeições livres
				</Label>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						type="button"
						onClick={() => setCheatMealBudget((v) => Math.max(0, v - 1))}
						disabled={cheatMealBudget <= 0}
						className="size-9 shrink-0"
					>
						<Minus className="size-4" />
					</Button>
					<span className="w-8 text-center font-medium tabular-nums text-sm">
						{cheatMealBudget}
					</span>
					<Button
						variant="outline"
						size="icon"
						type="button"
						onClick={() => setCheatMealBudget((v) => Math.min(7, v + 1))}
						disabled={cheatMealBudget >= 7}
						className="size-9 shrink-0"
					>
						<Plus className="size-4" />
					</Button>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<Button
					onClick={handleSave}
					disabled={isPending || !hasChanges}
					size="sm"
				>
					{isPending ? "Salvando..." : "Salvar metas"}
				</Button>
				{saved && <span className="text-sm text-muted-foreground">Salvo</span>}
			</div>
		</div>
	);
}
