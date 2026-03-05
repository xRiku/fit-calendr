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
		<div className="flex flex-col gap-4 w-full">
			<Card>
				<CardContent className="py-4">
					<div className="flex items-center gap-4">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-16 ml-auto" />
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="py-4">
					<div className="flex items-center gap-4 w-full">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 flex-1" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

async function BannerContent({
	isWorkout,
	selected,
}: { isWorkout: boolean; selected: string }) {
	if (isWorkout) {
		const [progress, { currentStreak, longestStreak }] = await Promise.all([
			getWeeklyProgress(),
			getGymStreak(),
		]);
		const current = progress.workouts;
		const goal = progress.weeklyWorkoutGoal;
		const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

		return (
			<div className="flex flex-col gap-4 w-full">
				<Card>
					<CardContent className="py-4 flex justify-between items-center">
						<div className="flex items-center gap-3">
							<Flame className="size-5 text-vibrant-green" />
							<span className="font-semibold">Sequência de Treinos</span>
						</div>
						<span className="text-sm text-muted-foreground font-medium">
							{currentStreak} dia{currentStreak !== 1 ? "s" : ""}
						</span>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="py-4 flex flex-col gap-3">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-3">
								<Target className="size-5 text-vibrant-green" />
								<span className="font-semibold">Meta Semanal</span>
							</div>
							<span className="text-sm text-muted-foreground font-medium">
								{current} / {goal}
							</span>
						</div>
						<div className="flex items-center gap-3 w-full">
							<div className="h-3 flex-1 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
								<div
									className="h-full rounded-full transition-all duration-300 bg-vibrant-green ease-out"
									style={{ width: `${pct}%` }}
								/>
							</div>
							<span className="text-[10px] text-muted-foreground uppercase font-semibold shrink-0">
								nesta semana
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Cheat meal mode
	const [progress, lastCheatMeal] = await Promise.all([
		getWeeklyProgress(),
		getLastCheatMeal(),
	]);
	const daysSince =
		lastCheatMeal.length > 0
			? differenceInDays(new Date(), lastCheatMeal[0].date)
			: 0;
	const current = progress.cheatMeals;
	const budget = progress.weeklyCheatMealBudget;
	const isOver = current > budget;
	const pct = budget > 0 ? Math.min((current / budget) * 100, 100) : 0;

	return (
		<div className="flex flex-col gap-4 w-full">
			<Card>
				<CardContent className="py-4 flex justify-between items-center">
					<div className="flex items-center gap-3">
						<Flame className="size-5 text-vibrant-orange" />
						<span className="font-semibold">Dias desde a última</span>
					</div>
					<span className="text-sm text-muted-foreground font-medium">
						{daysSince} dia{daysSince !== 1 ? "s" : ""}
					</span>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="py-4 flex flex-col gap-3">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-3">
							<Target className="size-5 text-vibrant-orange" />
							<span className="font-semibold">Cota Semanal</span>
						</div>
						<span className="text-sm text-muted-foreground font-medium">
							{current} / {budget}
						</span>
					</div>
					<div className="flex items-center gap-3 w-full">
						<div className="h-3 flex-1 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
							<div
								className={cn(
									"h-full rounded-full transition-all duration-300 ease-out",
									isOver ? "bg-red-500" : "bg-vibrant-orange",
								)}
								style={{ width: `${isOver ? 100 : pct}%` }}
							/>
						</div>
						<span className="text-[10px] text-muted-foreground uppercase font-semibold shrink-0">
							nesta semana
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function StreakCard({
	selected,
}: {
	selected: string;
}) {
	const isWorkout = selected === "workout";

	return (
		<Suspense fallback={<BannerSkeleton />}>
			<BannerContent isWorkout={isWorkout} selected={selected} />
		</Suspense>
	);
}
