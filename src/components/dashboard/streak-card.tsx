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

async function BannerContent({ isWorkout, selected }: { isWorkout: boolean; selected: string }) {
	const progress = await getWeeklyProgress();

	if (isWorkout) {
		const { currentStreak, longestStreak } = await getGymStreak();
		const current = progress.workouts;
		const goal = progress.weeklyWorkoutGoal;
		const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

		return (
			<div className="flex flex-col gap-4 w-full">
				<Card className="hover:border-vibrant-green/30 group">
					<CardContent className="py-5 px-6 flex justify-between items-center bg-gradient-to-br from-vibrant-green/5 to-transparent rounded-[20px]">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-xl bg-vibrant-green/10 text-vibrant-green group-hover:scale-110 transition-transform">
								<Flame className="size-5" />
							</div>
							<span className="font-semibold text-white/90">Workout Streak</span>
						</div>
						<span className="text-2xl text-white font-bold tracking-tight">
							{currentStreak} <span className="text-sm font-medium text-white/50">day{currentStreak !== 1 ? "s" : ""}</span>
						</span>
					</CardContent>
				</Card>

				<Card className="hover:border-vibrant-green/30 group">
					<CardContent className="py-5 px-6 flex flex-col gap-4 bg-gradient-to-br from-white/5 to-transparent rounded-[20px]">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-vibrant-green/10 text-vibrant-green group-hover:scale-110 transition-transform">
									<Target className="size-5" />
								</div>
								<span className="font-semibold text-white/90">Weekly Goal</span>
							</div>
							<span className="text-2xl text-white font-bold tracking-tight">
								{current} <span className="text-sm font-medium text-white/50">/ {goal}</span>
							</span>
						</div>
						<div className="flex items-center gap-3 w-full">
							<div className="h-2 flex-1 rounded-full bg-black/40 box-inner overflow-hidden">
								<div
									className="h-full rounded-full transition-all duration-500 bg-vibrant-green shadow-[0_0_10px_rgba(var(--vibrant-green),0.8)] ease-out"
									style={{ width: `${pct}%` }}
								/>
							</div>
							<span className="text-[10px] text-vibrant-green/70 tracking-wider uppercase font-bold shrink-0">
								this week
							</span>
						</div>
					</CardContent>
				</Card>
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
		<div className="flex flex-col gap-4 w-full">
			<Card className="hover:border-vibrant-orange/30 group">
				<CardContent className="py-5 px-6 flex justify-between items-center bg-gradient-to-br from-vibrant-orange/5 to-transparent rounded-[20px]">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-vibrant-orange/10 text-vibrant-orange group-hover:scale-110 transition-transform">
							<Flame className="size-5" />
						</div>
						<span className="font-semibold text-white/90">Days since last</span>
					</div>
					<span className="text-2xl text-white font-bold tracking-tight">
						{daysSince} <span className="text-sm font-medium text-white/50">day{daysSince !== 1 ? "s" : ""}</span>
					</span>
				</CardContent>
			</Card>

			<Card className="hover:border-vibrant-orange/30 group">
				<CardContent className="py-5 px-6 flex flex-col gap-4 bg-gradient-to-br from-white/5 to-transparent rounded-[20px]">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-xl bg-vibrant-orange/10 text-vibrant-orange group-hover:scale-110 transition-transform">
								<Target className="size-5" />
							</div>
							<span className="font-semibold text-white/90">Weekly Budget</span>
						</div>
						<span className="text-2xl text-white font-bold tracking-tight">
							{current} <span className="text-sm font-medium text-white/50">/ {budget}</span>
						</span>
					</div>
					<div className="flex items-center gap-3 w-full">
						<div className="h-2 flex-1 rounded-full bg-black/40 box-inner overflow-hidden">
							<div
								className={cn(
									"h-full rounded-full transition-all duration-500 ease-out",
									isOver ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-vibrant-orange shadow-[0_0_10px_rgba(var(--vibrant-orange),0.8)]",
								)}
								style={{ width: `${isOver ? 100 : pct}%` }}
							/>
						</div>
						<span className="text-[10px] text-vibrant-orange/70 tracking-wider uppercase font-bold shrink-0">
							this week
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
