import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGymStreak } from "@/lib/server-utils";
import { Flame } from "lucide-react";
import { Suspense } from "react";
import { CardSkeleton } from "./card-skeleton";

const options: {
	[key: string]: {
		title: string;
		fetchCall: typeof getGymStreak;
		color: string;
	};
} = {
	workout: {
		title: "Workout Streak",
		fetchCall: getGymStreak,
		color: "text-vibrant-green",
	},
};

export default async function StreakCard({
	selected,
}: {
	selected: string;
}) {
	async function CardData() {
		const { currentStreak, longestStreak } =
			await options[selected].fetchCall();

		return (
			<div className="flex items-baseline gap-2">
				<span className="text-3xl font-bold">{currentStreak}</span>
				<span className="text-sm text-muted-foreground">
					day{currentStreak !== 1 ? "s" : ""}
				</span>
				{longestStreak > 0 && (
					<span className="text-xs text-muted-foreground ml-2">
						(best: {longestStreak})
					</span>
				)}
			</div>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-base font-semibold flex items-center gap-2">
					<Flame className={`size-4 ${options[selected].color}`} />
					{options[selected].title}
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
