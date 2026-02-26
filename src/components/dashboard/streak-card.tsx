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
			<div className="flex flex-col gap-4 w-full font-mono">
				<Card className="hover:border-vibrant-green/50 hover:shadow-[0_0_20px_rgba(var(--vibrant-green),0.15)] group rounded-none border border-primary/20 bg-[#05050A]/80 shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all">
					<CardContent className="py-5 px-6 flex justify-between items-center bg-gradient-to-br from-vibrant-green/5 to-transparent rounded-none">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-none border border-vibrant-green/30 bg-vibrant-green/10 text-vibrant-green group-hover:scale-105 transition-transform shadow-[inset_0_0_10px_rgba(var(--vibrant-green),0.2)]">
								<Flame className="size-5 filter drop-shadow-[0_0_5px_rgba(var(--vibrant-green),0.8)]" />
							</div>
							<span className="font-bold tracking-widest uppercase text-white/90">XP Streak Multiplier</span>
						</div>
						<span className="text-2xl text-vibrant-green font-bold tracking-tight drop-shadow-[0_0_8px_rgba(var(--vibrant-green),0.8)]">
							{currentStreak} <span className="text-sm font-medium text-vibrant-green/50 uppercase tracking-widest">day{currentStreak !== 1 ? "s" : ""}</span>
						</span>
					</CardContent>
				</Card>

				<Card className="hover:border-vibrant-green/50 hover:shadow-[0_0_20px_rgba(var(--vibrant-green),0.15)] group rounded-none border border-primary/20 bg-[#05050A]/80 shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all">
					<CardContent className="py-5 px-6 flex flex-col gap-4 bg-gradient-to-br from-white/5 to-transparent rounded-none">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-none border border-vibrant-green/30 bg-vibrant-green/10 text-vibrant-green group-hover:scale-105 transition-transform shadow-[inset_0_0_10px_rgba(var(--vibrant-green),0.2)]">
									<Target className="size-5 filter drop-shadow-[0_0_5px_rgba(var(--vibrant-green),0.8)]" />
								</div>
								<span className="font-bold tracking-widest uppercase text-white/90">Weekly XP Target</span>
							</div>
							<span className="text-2xl text-vibrant-green font-bold tracking-tight drop-shadow-[0_0_8px_rgba(var(--vibrant-green),0.8)]">
								{current} <span className="text-sm font-medium text-vibrant-green/50">/ {goal}</span>
							</span>
						</div>
						<div className="flex items-center gap-3 w-full">
							<div className="h-2 flex-1 rounded-none bg-black border border-white/5 overflow-hidden shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]">
								<div
									className="h-full transition-all duration-500 bg-vibrant-green shadow-[0_0_10px_rgba(var(--vibrant-green),0.8)] ease-out"
									style={{ width: `${pct}%` }}
								/>
							</div>
							<span className="text-[10px] text-vibrant-green/70 tracking-widest uppercase font-bold shrink-0">
								current mission
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
		<div className="flex flex-col gap-4 w-full font-mono">
			<Card className="hover:border-vibrant-orange/50 hover:shadow-[0_0_20px_rgba(var(--vibrant-orange),0.15)] group rounded-none border border-primary/20 bg-[#05050A]/80 shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all">
				<CardContent className="py-5 px-6 flex justify-between items-center bg-gradient-to-br from-vibrant-orange/5 to-transparent rounded-none">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-none border border-vibrant-orange/30 bg-vibrant-orange/10 text-vibrant-orange group-hover:scale-105 transition-transform shadow-[inset_0_0_10px_rgba(var(--vibrant-orange),0.2)]">
							<Flame className="size-5 filter drop-shadow-[0_0_5px_rgba(var(--vibrant-orange),0.8)]" />
						</div>
						<span className="font-bold tracking-widest uppercase text-white/90">Days Without HP Damage</span>
					</div>
					<span className="text-2xl text-vibrant-orange font-bold tracking-tight drop-shadow-[0_0_8px_rgba(var(--vibrant-orange),0.8)]">
						{daysSince} <span className="text-sm font-medium text-vibrant-orange/50 uppercase tracking-widest">day{daysSince !== 1 ? "s" : ""}</span>
					</span>
				</CardContent>
			</Card>

			<Card className="hover:border-vibrant-orange/50 hover:shadow-[0_0_20px_rgba(var(--vibrant-orange),0.15)] group rounded-none border border-primary/20 bg-[#05050A]/80 shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all">
				<CardContent className="py-5 px-6 flex flex-col gap-4 bg-gradient-to-br from-white/5 to-transparent rounded-none">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-none border border-vibrant-orange/30 bg-vibrant-orange/10 text-vibrant-orange group-hover:scale-105 transition-transform shadow-[inset_0_0_10px_rgba(var(--vibrant-orange),0.2)]">
								<Target className="size-5 filter drop-shadow-[0_0_5px_rgba(var(--vibrant-orange),0.8)]" />
							</div>
							<span className="font-bold tracking-widest uppercase text-white/90">Weekly HP Budget</span>
						</div>
						<span className="text-2xl text-vibrant-orange font-bold tracking-tight drop-shadow-[0_0_8px_rgba(var(--vibrant-orange),0.8)]">
							{current} <span className="text-sm font-medium text-vibrant-orange/50">/ {budget}</span>
						</span>
					</div>
					<div className="flex items-center gap-3 w-full">
						<div className="h-2 flex-1 rounded-none border border-white/5 bg-black overflow-hidden shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]">
							<div
								className={cn(
									"h-full transition-all duration-500 ease-out",
									isOver ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-vibrant-orange shadow-[0_0_10px_rgba(var(--vibrant-orange),0.8)]",
								)}
								style={{ width: `${isOver ? 100 : pct}%` }}
							/>
						</div>
						<span className="text-[10px] text-vibrant-orange/70 tracking-widest uppercase font-bold shrink-0">
							current mission
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
