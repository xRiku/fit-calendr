import { Flame } from "lucide-react";

interface GroupStreakBannerProps {
	currentGroupStreak: number;
	longestGroupStreak: number;
}

export function GroupStreakBanner({
	currentGroupStreak,
	longestGroupStreak,
}: GroupStreakBannerProps) {
	if (currentGroupStreak === 0 && longestGroupStreak === 0) return null;

	return (
		<div className="flex items-center justify-between rounded-xl border border-vibrant-green/20 bg-vibrant-green/5 px-4 py-3">
			<div className="flex items-center gap-2">
				<Flame className="size-5 text-vibrant-green" />
				<div>
					<p className="text-sm font-semibold">
						Streak do grupo:{" "}
						<span className="text-vibrant-green">
							{currentGroupStreak} {currentGroupStreak === 1 ? "dia" : "dias"}
						</span>
					</p>
					{longestGroupStreak > currentGroupStreak && (
						<p className="text-xs text-muted-foreground">
							Melhor: {longestGroupStreak} dias
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
