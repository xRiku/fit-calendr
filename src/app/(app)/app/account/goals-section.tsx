"use client";

import { updateUserGoals } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, Utensils } from "lucide-react";
import { useTransition, useState } from "react";

export function GoalsSection({
	defaultWorkoutGoal,
	defaultCheatMealBudget,
}: {
	defaultWorkoutGoal: number;
	defaultCheatMealBudget: number;
}) {
	const [isPending, startTransition] = useTransition();
	const [workoutGoal, setWorkoutGoal] = useState(() => defaultWorkoutGoal);
	const [cheatMealBudget, setCheatMealBudget] = useState(
		() => defaultCheatMealBudget,
	);
	const [saved, setSaved] = useState(false);

	const hasChanges =
		workoutGoal !== defaultWorkoutGoal ||
		cheatMealBudget !== defaultCheatMealBudget;

	function handleSave() {
		startTransition(async () => {
			await updateUserGoals({
				weeklyWorkoutGoal: workoutGoal,
				weeklyCheatMealBudget: cheatMealBudget,
			});
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		});
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<Label
					htmlFor="workout-goal"
					className="flex items-center gap-2 text-sm"
				>
					<Dumbbell className="size-4 text-vibrant-green" />
					Weekly workout goal
				</Label>
				<Input
					id="workout-goal"
					type="number"
					min={1}
					max={7}
					value={workoutGoal}
					onChange={(e) =>
						setWorkoutGoal(
							Math.min(
								7,
								Math.max(1, Number.parseInt(e.target.value, 10) || 1),
							),
						)
					}
					className="w-20"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<Label
					htmlFor="cheat-meal-budget"
					className="flex items-center gap-2 text-sm"
				>
					<Utensils className="size-4 text-vibrant-orange" />
					Weekly cheat meal budget
				</Label>
				<Input
					id="cheat-meal-budget"
					type="number"
					min={0}
					max={7}
					value={cheatMealBudget}
					onChange={(e) =>
						setCheatMealBudget(
							Math.min(
								7,
								Math.max(0, Number.parseInt(e.target.value, 10) || 0),
							),
						)
					}
					className="w-20"
				/>
			</div>
			<div className="flex items-center gap-3">
				<Button
					onClick={handleSave}
					disabled={isPending || !hasChanges}
					size="sm"
				>
					{isPending ? "Saving..." : "Save goals"}
				</Button>
				{saved && <span className="text-sm text-muted-foreground">Saved</span>}
			</div>
		</div>
	);
}
