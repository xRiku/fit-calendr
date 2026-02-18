import { Card, CardContent } from "@/components/ui/card";
import {
	getGymStreak,
	getLastCheatMeal,
	getWeeklyProgress,
} from "@/lib/server-utils";
import { cn } from "@/lib/utils";
import { differenceInDays } from "date-fns";
import { Flame, Target } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function BannerSkeleton() {
	return (
		<div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full">
			<Skeleton className="h-6 w-48" />
			<Skeleton className="hidden sm:block h-8 w-px" />
			<Skeleton className="h-6 w-64" />
		</div>
	);
}

export default function StreakCard({
	selected,
}: {
	selected: string;
}) {
	const isWorkout = selected === "workout";

	async function BannerContent() {
		const progress = await getWeeklyProgress();

		if (isWorkout) {
			const { currentStreak, longestStreak } = await getGymStreak();
			const current = progress.workouts;
			const goal = progress.weeklyWorkoutGoal;
			const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

			return (
				<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
					<div className="flex items-center gap-2 shrink-0">
						<Flame className="size-4 text-vibrant-green" />
						<span className="text-sm font-medium">Workout Streak</span>
						<span className="text-sm text-muted-foreground">
							{currentStreak} day{currentStreak !== 1 ? "s" : ""}
							{longestStreak > 0 && ` (best: ${longestStreak})`}
						</span>
					</div>

					<div className="hidden sm:block h-8 w-px bg-border shrink-0" />

					<div className="flex items-center gap-3 flex-1 min-w-0">
						<Target className="size-4 shrink-0" />
						<span className="text-sm font-medium shrink-0">Weekly Goal</span>
						<span className="text-sm text-muted-foreground shrink-0">
							{current} / {goal} workouts
						</span>
						<div className="h-2 flex-1 rounded-full bg-muted overflow-hidden min-w-16">
							<div
								className="h-full rounded-full transition-all bg-vibrant-green"
								style={{ width: `${pct}%` }}
							/>
						</div>
						<span className="text-xs text-muted-foreground shrink-0">
							this week
						</span>
					</div>
				</div>
			);
		}

		// Cheat meal mode
		const lastCheatMeal = await getLastCheatMeal();
		const daysSince =
			lastCheatMeal.length > 0
				? differenceInDays(new Date(), lastCheatMeal[0].date)
				: 0;
		const current = progress.cheatMeals;
		const budget = progress.weeklyCheatMealBudget;
		const isOver = current > budget;
		const pct = budget > 0 ? Math.min((current / budget) * 100, 100) : 0;

		return (
			<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
				<div className="flex items-center gap-2 shrink-0">
					<span className="text-sm font-medium">
						Days since last cheat meal
					</span>
					<span className="text-sm text-muted-foreground">
						{daysSince} day{daysSince !== 1 ? "s" : ""}
					</span>
				</div>

				<div className="hidden sm:block h-8 w-px bg-border shrink-0" />

				<div className="flex items-center gap-3 flex-1 min-w-0">
					<Target className="size-4 shrink-0" />
					<span className="text-sm font-medium shrink-0">Weekly Budget</span>
					<span className="text-sm text-muted-foreground shrink-0">
						{current} / {budget} cheat meals
					</span>
					<div className="h-2 flex-1 rounded-full bg-muted overflow-hidden min-w-16">
						<div
							className={cn(
								"h-full rounded-full transition-all",
								isOver ? "bg-red-500" : "bg-vibrant-orange",
							)}
							style={{ width: `${isOver ? 100 : pct}%` }}
						/>
					</div>
					<span className="text-xs text-muted-foreground shrink-0">
						this week
					</span>
				</div>
			</div>
		);
	}

	return (
		<Card>
			<CardContent className="py-3">
				<Suspense fallback={<BannerSkeleton />}>
					<BannerContent />
				</Suspense>
			</CardContent>
		</Card>
	);
}
