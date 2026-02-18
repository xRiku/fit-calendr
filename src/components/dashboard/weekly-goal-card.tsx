import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeeklyProgress } from "@/lib/server-utils";
import { cn } from "@/lib/utils";
import { Target } from "lucide-react";
import { Suspense } from "react";
import { CardSkeleton } from "./card-skeleton";

export default function WeeklyGoalCard({
	selected,
}: {
	selected: string;
}) {
	async function CardData() {
		const progress = await getWeeklyProgress();

		const isWorkout = selected === "workout";
		const current = isWorkout ? progress.workouts : progress.cheatMeals;
		const goal = isWorkout
			? progress.weeklyWorkoutGoal
			: progress.weeklyCheatMealBudget;
		const label = isWorkout ? "workouts" : "cheat meals";

		const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

		// For workouts: green when meeting goal. For cheat meals: red when over budget
		const isOver = current > goal;
		const barColor = isWorkout
			? "bg-vibrant-green"
			: isOver
				? "bg-red-500"
				: "bg-vibrant-orange";

		return (
			<div className="flex flex-col gap-2">
				<div className="flex items-baseline gap-1">
					<span className="text-2xl font-bold">{current}</span>
					<span className="text-sm text-muted-foreground">
						/ {goal} {label}
					</span>
				</div>
				<div className="h-2 w-full rounded-full bg-muted overflow-hidden">
					<div
						className={cn("h-full rounded-full transition-all", barColor)}
						style={{ width: `${isOver ? 100 : pct}%` }}
					/>
				</div>
				<p className="text-xs text-muted-foreground">this week</p>
			</div>
		);
	}

	return (
		<Card className="h-full">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-base font-semibold flex items-center gap-2">
					<Target className="size-4" />
					Weekly Goal
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Suspense fallback={<CardSkeleton />}>
					<CardData />
				</Suspense>
			</CardContent>
		</Card>
	);
}
