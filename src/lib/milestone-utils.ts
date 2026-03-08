import prisma from "./db";
import { calculateStreak } from "./server-utils";

const STREAK_MILESTONES = [7, 14, 30, 60, 90, 100, 365];
const COUNT_MILESTONES = [50, 100, 200, 365, 500, 1000];

export async function checkAndCreateMilestoneNotifications(userId: string) {
	// Find all active groups this user belongs to
	const memberships = await prisma.groupMember.findMany({
		where: { userId },
		include: {
			group: {
				include: { members: { select: { userId: true } } },
			},
		},
	});

	if (memberships.length === 0) return;

	// Fetch all workout dates for streak calculation
	const allWorkouts = await prisma.gymCheck.findMany({
		where: { userId },
		select: { date: true },
		orderBy: { date: "asc" },
	});

	const totalCount = allWorkouts.length;
	const { currentStreak } = calculateStreak(allWorkouts.map((w) => w.date));

	const streakMilestone = STREAK_MILESTONES.includes(currentStreak)
		? currentStreak
		: null;
	const countMilestone = COUNT_MILESTONES.includes(totalCount)
		? totalCount
		: null;

	if (!streakMilestone && !countMilestone) return;

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { name: true },
	});
	if (!user) return;

	for (const membership of memberships) {
		const otherMemberIds = membership.group.members
			.map((m) => m.userId)
			.filter((id) => id !== userId);

		if (otherMemberIds.length === 0) continue;

		// Deduplication: check for recent similar notifications (last 24h)
		const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

		if (streakMilestone) {
			const message = `${user.name} atingiu ${streakMilestone} dias de streak!`;

			const existing = await prisma.groupNotification.findFirst({
				where: {
					groupId: membership.groupId,
					type: "streak_milestone",
					message,
					createdAt: { gte: oneDayAgo },
				},
			});

			if (!existing) {
				await prisma.groupNotification.createMany({
					data: otherMemberIds.map((memberId) => ({
						groupId: membership.groupId,
						userId: memberId,
						type: "streak_milestone",
						message,
					})),
				});
			}
		}

		if (countMilestone) {
			const message = `${user.name} completou ${countMilestone} treinos!`;

			const existing = await prisma.groupNotification.findFirst({
				where: {
					groupId: membership.groupId,
					type: "count_milestone",
					message,
					createdAt: { gte: oneDayAgo },
				},
			});

			if (!existing) {
				await prisma.groupNotification.createMany({
					data: otherMemberIds.map((memberId) => ({
						groupId: membership.groupId,
						userId: memberId,
						type: "count_milestone",
						message,
					})),
				});
			}
		}
	}
}
