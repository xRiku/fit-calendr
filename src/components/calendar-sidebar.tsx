import {
	getUserCheatMealPresets,
	getUserPresets,
} from "@/actions/preset-actions";
import {
	getCheatMealsByYearGroupedByMonth,
	getCheatMealStreak,
	getGymChecksByYearGroupedByMonth,
	getGymStreak,
} from "@/lib/server-utils";
import { Dumbbell, Flame, UtensilsCrossed } from "lucide-react";
import { Suspense } from "react";
import PresetLegend from "./preset-legend";

function StatItem({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
}) {
	return (
		<div className="rounded-lg border border-border/50 p-3 space-y-1">
			<div className="flex items-center gap-2 text-xs text-muted-foreground">
				{icon}
				{label}
			</div>
			<div className="text-2xl font-bold">{value}</div>
		</div>
	);
}

function StatSkeleton() {
	return (
		<div className="rounded-lg border border-border/50 p-3 space-y-2 animate-pulse">
			<div className="h-3 w-24 bg-muted rounded" />
			<div className="h-7 w-10 bg-muted rounded" />
		</div>
	);
}

function LegendSkeleton() {
	return (
		<div className="space-y-2 animate-pulse">
			<div className="h-3 w-20 bg-muted rounded" />
			<div className="h-3 w-24 bg-muted rounded" />
			<div className="h-3 w-16 bg-muted rounded" />
		</div>
	);
}

async function PresetLegendLoader() {
	const [workoutPresets, cheatMealPresets] = await Promise.all([
		getUserPresets(),
		getUserCheatMealPresets(),
	]);

	return (
		<PresetLegend
			workoutPresets={workoutPresets.map((p) => ({
				id: p.id,
				label: p.label,
				color: p.color,
			}))}
			cheatMealPresets={cheatMealPresets.map((p) => ({
				id: p.id,
				label: p.label,
				color: p.color,
			}))}
		/>
	);
}

async function SidebarStats() {
	const [gymData, cheatData, gymStreak, cheatStreak] = await Promise.all([
		getGymChecksByYearGroupedByMonth(),
		getCheatMealsByYearGroupedByMonth(),
		getGymStreak(),
		getCheatMealStreak(),
	]);
	const month = new Date().getMonth();
	const workoutCount = gymData.hashTable[month]?.length ?? 0;
	const cheatCount = cheatData.hashTable[month]?.length ?? 0;

	return (
		<div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
			<StatItem
				icon={<Dumbbell className="size-4 text-vibrant-green" />}
				label="Workouts this month"
				value={workoutCount}
			/>
			<StatItem
				icon={<UtensilsCrossed className="size-4 text-vibrant-orange" />}
				label="Cheat meals this month"
				value={cheatCount}
			/>
			<StatItem
				icon={<Flame className="size-4 text-vibrant-green" />}
				label="Workout streak"
				value={`${gymStreak.currentStreak} day${gymStreak.currentStreak !== 1 ? "s" : ""}`}
			/>
			<StatItem
				icon={<Flame className="size-4 text-vibrant-orange" />}
				label="Cheat meal streak"
				value={`${cheatStreak.currentStreak} day${cheatStreak.currentStreak !== 1 ? "s" : ""}`}
			/>
		</div>
	);
}

export default function CalendarSidebar() {
	return (
		<aside className="lg:w-64 lg:shrink-0 lg:border-r lg:border-border/50 lg:pr-6 space-y-6">
			<div>
				<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
					Legend
				</h3>
				<Suspense fallback={<LegendSkeleton />}>
					<PresetLegendLoader />
				</Suspense>
			</div>
			<div>
				<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
					This Month
				</h3>
				<Suspense
					fallback={
						<div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
							<StatSkeleton />
							<StatSkeleton />
							<StatSkeleton />
							<StatSkeleton />
						</div>
					}
				>
					<SidebarStats />
				</Suspense>
			</div>
		</aside>
	);
}
