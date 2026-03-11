import { getMobileSession } from "@/lib/mobile-auth";
import { calculateGoalStreak, calculateStreak } from "@/lib/core-utils";
import prisma from "@/lib/db";

export async function GET(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const now = new Date();
	const day = now.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	const monday = new Date(now);
	monday.setDate(now.getDate() + diff);
	monday.setHours(0, 0, 0, 0);
	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);
	sunday.setHours(23, 59, 59, 999);

	const [gymChecks, cheatMeals, user, weeklyWorkouts, weeklyCheatMeals, totalWorkouts, totalCheatMeals] =
		await Promise.all([
			prisma.gymCheck.findMany({
				where: { userId: userId! },
				select: { date: true },
				orderBy: { date: "asc" },
			}),
			prisma.cheatMeal.findMany({
				where: { userId: userId! },
				select: { date: true },
			}),
			prisma.user.findUniqueOrThrow({
				where: { id: userId! },
				select: { weeklyWorkoutGoal: true, weeklyCheatMealBudget: true },
			}),
			prisma.gymCheck.count({
				where: { userId: userId!, date: { gte: monday, lte: sunday } },
			}),
			prisma.cheatMeal.count({
				where: { userId: userId!, date: { gte: monday, lte: sunday } },
			}),
			prisma.gymCheck.count({ where: { userId: userId! } }),
			prisma.cheatMeal.count({ where: { userId: userId! } }),
		]);

	const streak = calculateStreak(gymChecks.map((g) => g.date));
	const goalStreak = calculateGoalStreak(
		gymChecks.map((g) => g.date),
		cheatMeals.map((c) => c.date),
		user.weeklyWorkoutGoal,
		user.weeklyCheatMealBudget,
	);

	return Response.json({
		streak,
		goalStreak,
		weeklyProgress: {
			workouts: weeklyWorkouts,
			cheatMeals: weeklyCheatMeals,
			weeklyWorkoutGoal: user.weeklyWorkoutGoal,
			weeklyCheatMealBudget: user.weeklyCheatMealBudget,
		},
		totals: {
			workouts: totalWorkouts,
			cheatMeals: totalCheatMeals,
		},
	});
}
