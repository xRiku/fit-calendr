import { getMobileSession } from "@/lib/mobile-auth";
import { calculateGoalStreak, calculateStreak } from "@/lib/core-utils";
import prisma from "@/lib/db";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ groupId: string; username: string }> },
) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const { groupId, username } = await params;

	// Viewer must be in group
	const viewerMembership = await prisma.groupMember.findUnique({
		where: { groupId_userId: { groupId, userId: userId! } },
	});
	if (!viewerMembership) return Response.json({ error: "Not a member" }, { status: 403 });

	const targetUser = await prisma.user.findUnique({ where: { username } });
	if (!targetUser) return Response.json({ error: "User not found" }, { status: 404 });

	const [targetMembership, group] = await Promise.all([
		prisma.groupMember.findUnique({
			where: { groupId_userId: { groupId, userId: targetUser.id } },
			include: {
				user: { select: { id: true, name: true, username: true, avatarUrl: true } },
			},
		}),
		prisma.group.findUnique({ where: { id: groupId } }),
	]);
	if (!targetMembership || !group) return Response.json({ error: "Not found" }, { status: 404 });

	const year = new Date().getFullYear();
	const challengeStartDate = new Date(group.startDate);
	challengeStartDate.setHours(0, 0, 0, 0);
	const rangeEnd = new Date(group.endDate) < new Date() ? group.endDate : new Date();

	const [allWorkouts, challengeWorkouts, allTimeWorkouts, allTimeCheatMeals, targetUserGoals] =
		await Promise.all([
			prisma.gymCheck.findMany({
				where: {
					userId: targetUser.id,
					date: { gte: new Date(year, 0, 1), lte: new Date(year, 11, 31, 23, 59, 59) },
				},
				select: { date: true },
				orderBy: { date: "asc" },
			}),
			prisma.gymCheck.count({
				where: { userId: targetUser.id, date: { gte: challengeStartDate, lte: rangeEnd } },
			}),
			prisma.gymCheck.findMany({
				where: { userId: targetUser.id },
				select: { date: true },
				orderBy: { date: "asc" },
			}),
			prisma.cheatMeal.findMany({
				where: { userId: targetUser.id },
				select: { date: true },
			}),
			prisma.user.findUniqueOrThrow({
				where: { id: targetUser.id },
				select: { weeklyWorkoutGoal: true, weeklyCheatMealBudget: true },
			}),
		]);

	const heatmapData: Record<string, number> = {};
	for (const w of allWorkouts) {
		const d = new Date(w.date);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
		heatmapData[key] = (heatmapData[key] ?? 0) + 1;
	}

	const { currentStreak, longestStreak } = calculateStreak(allTimeWorkouts.map((w) => w.date));
	const goalStreak = calculateGoalStreak(
		allTimeWorkouts.map((w) => w.date),
		allTimeCheatMeals.map((c) => c.date),
		targetUserGoals.weeklyWorkoutGoal,
		targetUserGoals.weeklyCheatMealBudget,
	);

	return Response.json({
		user: targetMembership.user,
		group,
		joinedAt: targetMembership.joinedAt,
		role: targetMembership.role,
		stats: {
			currentStreak,
			longestStreak,
			totalWorkouts: allTimeWorkouts.length,
			challengeWorkouts,
			goalStreak,
		},
		heatmapData,
		year,
		isOwnProfile: userId === targetUser.id,
	});
}
