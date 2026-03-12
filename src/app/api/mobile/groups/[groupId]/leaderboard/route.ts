import { getMobileSession } from "@/lib/mobile-auth";
import { calculateStreak, countFiltered, filterRetroactiveChecks } from "@/lib/core-utils";
import prisma from "@/lib/db";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ groupId: string }> },
) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const { groupId } = await params;

	const membership = await prisma.groupMember.findUnique({
		where: { groupId_userId: { groupId, userId: userId! } },
	});
	if (!membership) return Response.json({ error: "Not a member" }, { status: 403 });

	const group = await prisma.group.findUnique({
		where: { id: groupId },
		include: {
			members: {
				include: {
					user: { select: { id: true, name: true, username: true, avatarUrl: true } },
				},
			},
		},
	});
	if (!group) return Response.json({ error: "Not found" }, { status: 404 });

	const memberIds = group.members.map((m) => m.userId);

	const challengeStartDate = new Date(group.startDate);
	challengeStartDate.setUTCHours(0, 0, 0, 0);
	const rangeEnd = new Date(group.endDate) < new Date() ? group.endDate : new Date();

	// Weekly leaderboard
	const now = new Date();
	const day = now.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	const monday = new Date(now);
	monday.setDate(now.getDate() + diff);
	monday.setHours(0, 0, 0, 0);
	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);
	sunday.setHours(23, 59, 59, 999);

	const lastMonday = new Date(monday);
	lastMonday.setDate(monday.getDate() - 7);
	const lastSunday = new Date(monday);
	lastSunday.setDate(monday.getDate() - 1);
	lastSunday.setHours(23, 59, 59, 999);

	const weeklyStart = monday > challengeStartDate ? monday : challengeStartDate;
	const lastWeekStart = lastMonday > challengeStartDate ? lastMonday : challengeStartDate;

	const [overallWorkouts, weeklyWorkouts, lastWeekWorkouts, streakWorkouts] = await Promise.all([
		prisma.gymCheck.findMany({
			where: { userId: { in: memberIds }, date: { gte: challengeStartDate, lte: rangeEnd } },
			select: { userId: true, date: true, createdAt: true },
		}),
		prisma.gymCheck.findMany({
			where: { userId: { in: memberIds }, date: { gte: weeklyStart, lte: sunday } },
			select: { userId: true, date: true, createdAt: true },
		}),
		prisma.gymCheck.findMany({
			where: { userId: { in: memberIds }, date: { gte: lastWeekStart, lte: lastSunday } },
			select: { userId: true, date: true, createdAt: true },
		}),
		prisma.gymCheck.findMany({
			where: { userId: { in: memberIds }, date: { gte: new Date(Date.now() - 400 * 86400000) } },
			select: { userId: true, date: true, createdAt: true },
			orderBy: { date: "asc" },
		}),
	]);

	const overallCountMap = countFiltered(overallWorkouts, group.allowRetroactiveWorkouts);
	const weeklyCountMap = countFiltered(weeklyWorkouts, group.allowRetroactiveWorkouts);
	const lastWeekCountMap = countFiltered(lastWeekWorkouts, group.allowRetroactiveWorkouts);

	const filteredStreak = filterRetroactiveChecks(streakWorkouts, group.allowRetroactiveWorkouts);
	const datesByUser = new Map<string, Date[]>();
	for (const w of filteredStreak) {
		const dates = datesByUser.get(w.userId) ?? [];
		dates.push(w.date);
		datesByUser.set(w.userId, dates);
	}

	const overallLeaderboard = group.members
		.map((m) => ({ ...m, workoutCount: overallCountMap.get(m.userId) ?? 0 }))
		.sort((a, b) => b.workoutCount - a.workoutCount);

	const weeklyLeaderboard = group.members
		.map((m) => ({ ...m, workoutCount: weeklyCountMap.get(m.userId) ?? 0 }))
		.sort((a, b) => b.workoutCount - a.workoutCount);

	const streakLeaderboard = group.members
		.map((m) => {
			const dates = datesByUser.get(m.userId) ?? [];
			const { currentStreak, longestStreak } = calculateStreak(dates);
			return { ...m, currentStreak, longestStreak };
		})
		.sort((a, b) => b.currentStreak - a.currentStreak);

	// Last week MVP
	let lastWeekMvp = null;
	if (lastWeekCountMap.size > 0 && challengeStartDate <= lastSunday) {
		let topUserId = "";
		let topCount = 0;
		for (const [uid, count] of lastWeekCountMap) {
			if (count > topCount) {
				topCount = count;
				topUserId = uid;
			}
		}
		const mvpMember = group.members.find((m) => m.userId === topUserId);
		if (mvpMember) {
			lastWeekMvp = { user: mvpMember.user, workoutCount: topCount };
		}
	}

	return Response.json({
		overallLeaderboard,
		weeklyLeaderboard,
		streakLeaderboard,
		lastWeekMvp,
		weekStart: monday,
	});
}
