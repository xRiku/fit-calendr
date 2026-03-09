"use server-only";

import type {
	CheatMealModel,
	GymCheckModel,
} from "@/../prisma/generated/models";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./auth";
import prisma from "./db";

type HasDate = { date: Date };

function groupByMonth<T extends HasDate>(
	items: T[],
): {
	hashTable: { [key: number]: T[] };
	count: number;
} {
	const hashTable: { [key: number]: T[] } = {};
	for (const item of items) {
		const date = new Date(item.date);
		const month = date.getUTCMonth();
		if (!hashTable[month]) {
			hashTable[month] = [item];
			continue;
		}
		hashTable[month].push(item);
	}
	return { hashTable, count: items.length };
}

export const getCheatMealsByYearGroupedByMonth = cache(
	async (params?: { year?: number }) => {
		const { year = new Date().getFullYear() } = params || {};
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) redirect("/auth/sign-in");

		const startDate = new Date(year, 0, 1);
		const endDate = new Date(year, 11, 31, 23, 59, 59);

		const data = await prisma.cheatMeal.findMany({
			where: {
				userId: session.user.id,
				date: { gte: startDate, lte: endDate },
			},
		});

		return groupByMonth<CheatMealModel>(data);
	},
);

export const getGymChecksByYearGroupedByMonth = cache(
	async (params?: { year?: number }) => {
		const { year = new Date().getFullYear() } = params || {};
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) redirect("/auth/sign-in");

		const startDate = new Date(year, 0, 1);
		const endDate = new Date(year, 11, 31, 23, 59, 59);

		const data = await prisma.gymCheck.findMany({
			where: {
				userId: session.user.id,
				date: { gte: startDate, lte: endDate },
			},
		});

		return groupByMonth<GymCheckModel>(data);
	},
);

export const getLastCheatMeal = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}
	const data = await prisma.cheatMeal.findMany({
		where: {
			userId: session.user.id,
			date: {
				lte: new Date(),
			},
		},
		orderBy: {
			date: "desc",
		},
		take: 1,
	});

	return data;
});

export const getLastGymWorkout = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}
	const data = await prisma.gymCheck.findMany({
		where: {
			userId: session.user.id,
			date: {
				lte: new Date(),
			},
		},
		orderBy: {
			date: "desc",
		},
		take: 1,
	});

	return data;
});

export const getAvailableYears = cache(async (): Promise<number[]> => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	const [gymChecks, cheatMeals] = await Promise.all([
		prisma.gymCheck.findMany({
			where: { userId: session.user.id },
			select: { date: true },
		}),
		prisma.cheatMeal.findMany({
			where: { userId: session.user.id },
			select: { date: true },
		}),
	]);

	const yearsSet = new Set<number>();
	const currentYear = new Date().getFullYear();
	yearsSet.add(currentYear);

	for (const check of gymChecks) {
		yearsSet.add(new Date(check.date).getFullYear());
	}

	for (const meal of cheatMeals) {
		yearsSet.add(new Date(meal.date).getFullYear());
	}

	return Array.from(yearsSet).sort((a, b) => b - a);
});

export function calculateStreak(dates: Date[]): {
	currentStreak: number;
	longestStreak: number;
} {
	if (dates.length === 0) {
		return { currentStreak: 0, longestStreak: 0 };
	}

	// Sort dates ascending (oldest first)
	const sortedDates = dates
		.map((d) => new Date(d))
		.sort((a, b) => a.getTime() - b.getTime());

	// Normalize dates to midnight for comparison
	const normalizeDate = (date: Date) => {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		return d.getTime();
	};

	const today = normalizeDate(new Date());

	// Calculate longest streak
	let longestStreak = 1;
	let currentLongestRun = 1;

	for (let i = 1; i < sortedDates.length; i++) {
		const prevDate = normalizeDate(sortedDates[i - 1]);
		const currDate = normalizeDate(sortedDates[i]);
		const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

		if (diffDays === 1) {
			currentLongestRun++;
			longestStreak = Math.max(longestStreak, currentLongestRun);
		} else if (diffDays > 1) {
			currentLongestRun = 1;
		}
	}

	// Calculate current streak (from today backwards)
	let currentStreak = 0;
	const hasEntryToday = sortedDates.some((d) => normalizeDate(d) === today);

	if (hasEntryToday) {
		currentStreak = 1;
		for (let i = sortedDates.length - 2; i >= 0; i--) {
			const currDate = normalizeDate(sortedDates[i + 1]);
			const prevDate = normalizeDate(sortedDates[i]);
			const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

			if (diffDays === 1) {
				currentStreak++;
			} else {
				break;
			}
		}
	} else {
		// Check if yesterday has entry (streak continues but not yet logged today)
		const yesterday = today - 24 * 60 * 60 * 1000;
		const hasEntryYesterday = sortedDates.some(
			(d) => normalizeDate(d) === yesterday,
		);

		if (hasEntryYesterday) {
			currentStreak = 1;
			for (let i = sortedDates.length - 2; i >= 0; i--) {
				const currDate = normalizeDate(sortedDates[i + 1]);
				const prevDate = normalizeDate(sortedDates[i]);
				const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

				if (diffDays === 1) {
					currentStreak++;
				} else {
					break;
				}
			}
		}
	}

	return { currentStreak, longestStreak };
}

export const getUserGoals = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	const user = await prisma.user.findUniqueOrThrow({
		where: { id: session.user.id },
		select: { weeklyWorkoutGoal: true, weeklyCheatMealBudget: true },
	});

	return user;
});

export const getWeeklyProgress = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	// Get Monday of current week
	const now = new Date();
	const day = now.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	const monday = new Date(now);
	monday.setDate(now.getDate() + diff);
	monday.setHours(0, 0, 0, 0);

	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);
	sunday.setHours(23, 59, 59, 999);

	const [workouts, cheatMeals, user] = await Promise.all([
		prisma.gymCheck.count({
			where: {
				userId: session.user.id,
				date: { gte: monday, lte: sunday },
			},
		}),
		prisma.cheatMeal.count({
			where: {
				userId: session.user.id,
				date: { gte: monday, lte: sunday },
			},
		}),
		prisma.user.findUniqueOrThrow({
			where: { id: session.user.id },
			select: { weeklyWorkoutGoal: true, weeklyCheatMealBudget: true },
		}),
	]);

	return {
		workouts,
		cheatMeals,
		weeklyWorkoutGoal: user.weeklyWorkoutGoal,
		weeklyCheatMealBudget: user.weeklyCheatMealBudget,
	};
});

export function calculateGoalStreak(
	gymCheckDates: Date[],
	cheatMealDates: Date[],
	weeklyWorkoutGoal: number,
	weeklyCheatMealBudget: number,
): { currentGoalStreak: number; longestGoalStreak: number } {
	if (weeklyWorkoutGoal <= 0) return { currentGoalStreak: 0, longestGoalStreak: 0 };

	// Get Monday of the current week (local time)
	const now = new Date();
	const day = now.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	const currentMonday = new Date(now);
	currentMonday.setDate(now.getDate() + diff);
	currentMonday.setHours(0, 0, 0, 0);

	// Find earliest date across all entries to know when to stop
	const allDates = [...gymCheckDates, ...cheatMealDates].map((d) => new Date(d));
	if (allDates.length === 0) return { currentGoalStreak: 0, longestGoalStreak: 0 };
	const earliestEntry = new Date(Math.min(...allDates.map((d) => d.getTime())));

	// Helper: count dates within [start, end]
	const countInRange = (dates: Date[], start: Date, end: Date) =>
		dates.filter((d) => {
			const t = new Date(d).getTime();
			return t >= start.getTime() && t <= end.getTime();
		}).length;

	let currentGoalStreak = 0;
	let longestGoalStreak = 0;
	let consecutiveRun = 0;
	let foundFirstNonPerfect = false;

	// Iterate backwards week by week starting from the most recent completed week
	let weekMonday = new Date(currentMonday);
	weekMonday.setDate(currentMonday.getDate() - 7);

	while (weekMonday >= earliestEntry || weekMonday.getTime() >= earliestEntry.getTime()) {
		const weekSunday = new Date(weekMonday);
		weekSunday.setDate(weekMonday.getDate() + 6);
		weekSunday.setHours(23, 59, 59, 999);

		// Stop if this week is entirely before any data
		if (weekSunday.getTime() < earliestEntry.getTime()) break;

		const workouts = countInRange(gymCheckDates.map((d) => new Date(d)), weekMonday, weekSunday);
		const cheatMeals = countInRange(cheatMealDates.map((d) => new Date(d)), weekMonday, weekSunday);
		const perfectWeek = workouts >= weeklyWorkoutGoal && cheatMeals <= weeklyCheatMealBudget;

		if (perfectWeek) {
			consecutiveRun++;
			longestGoalStreak = Math.max(longestGoalStreak, consecutiveRun);
			if (!foundFirstNonPerfect) {
				currentGoalStreak = consecutiveRun;
			}
		} else {
			foundFirstNonPerfect = true;
			consecutiveRun = 0;
		}

		weekMonday = new Date(weekMonday);
		weekMonday.setDate(weekMonday.getDate() - 7);
	}

	return { currentGoalStreak, longestGoalStreak };
}

export const getGoalStreak = cache(async () => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect("/auth/sign-in");

	const [gymChecks, cheatMeals, user] = await Promise.all([
		prisma.gymCheck.findMany({ where: { userId: session.user.id }, select: { date: true } }),
		prisma.cheatMeal.findMany({ where: { userId: session.user.id }, select: { date: true } }),
		prisma.user.findUniqueOrThrow({
			where: { id: session.user.id },
			select: { weeklyWorkoutGoal: true, weeklyCheatMealBudget: true },
		}),
	]);

	return calculateGoalStreak(
		gymChecks.map((g) => g.date),
		cheatMeals.map((c) => c.date),
		user.weeklyWorkoutGoal,
		user.weeklyCheatMealBudget,
	);
});

export const getGymStreak = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	const gymChecks = await prisma.gymCheck.findMany({
		where: {
			userId: session.user.id,
		},
		select: { date: true },
		orderBy: { date: "asc" },
	});

	const dates = gymChecks.map((g) => g.date);
	return calculateStreak(dates);
});

export const getUserTotalEntries = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	const [workoutCount, cheatMealCount] = await Promise.all([
		prisma.gymCheck.count({
			where: { userId: session.user.id },
		}),
		prisma.cheatMeal.count({
			where: { userId: session.user.id },
		}),
	]);

	return {
		total: workoutCount + cheatMealCount,
		workoutCount,
		cheatMealCount,
	};
});

// ─── Groups ───────────────────────────────────────────────────────────────────

export const getUserGroups = cache(async () => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect("/auth/sign-in");

	const memberships = await prisma.groupMember.findMany({
		where: { userId: session.user.id },
		include: {
			group: {
				include: {
					_count: { select: { members: true } },
				},
			},
		},
		orderBy: { joinedAt: "desc" },
	});

	return memberships.map((m) => ({ ...m.group, role: m.role }));
});

export const isGroupMember = cache(
	async (groupId: string): Promise<boolean> => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) return false;

		const member = await prisma.groupMember.findUnique({
			where: { groupId_userId: { groupId, userId: session.user.id } },
		});
		return !!member;
	},
);

export async function getMemberProfile(groupId: string, username: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect("/auth/sign-in");

	// Viewer must be in the group
	const viewerMembership = await prisma.groupMember.findUnique({
		where: { groupId_userId: { groupId, userId: session.user.id } },
	});
	if (!viewerMembership) redirect("/app/groups");

	// Look up target user by username
	const targetUser = await prisma.user.findUnique({ where: { username } });
	if (!targetUser) redirect(`/app/groups/${groupId}`);
	const targetUserId = targetUser.id;

	// Target must also be in the group
	const [targetMembership, group] = await Promise.all([
		prisma.groupMember.findUnique({
			where: { groupId_userId: { groupId, userId: targetUserId } },
			include: {
				user: {
					select: { id: true, name: true, username: true, avatarUrl: true },
				},
			},
		}),
		prisma.group.findUnique({ where: { id: groupId } }),
	]);
	if (!targetMembership) redirect(`/app/groups/${groupId}`);
	if (!group) redirect("/app/groups");

	const year = new Date().getFullYear();

	const rangeEnd =
		new Date(group.endDate) < new Date() ? group.endDate : new Date();

	// Normalize group start date to beginning of day (to include workouts from the join date)
	const challengeStartDate = new Date(group.startDate);
	challengeStartDate.setHours(0, 0, 0, 0);

	// Parallel DB fetches
	const [allWorkouts, challengeWorkouts, allTimeWorkouts, allTimeCheatMeals, targetUserGoals] = await Promise.all([
		// All workouts for heatmap (current year)
		prisma.gymCheck.findMany({
			where: {
				userId: targetUserId,
				date: {
					gte: new Date(year, 0, 1),
					lte: new Date(year, 11, 31, 23, 59, 59),
				},
			},
			select: { date: true },
			orderBy: { date: "asc" },
		}),
		// Workouts within challenge period
		prisma.gymCheck.count({
			where: {
				userId: targetUserId,
				date: { gte: challengeStartDate, lte: rangeEnd },
			},
		}),
		// All-time workouts for streak calculation
		prisma.gymCheck.findMany({
			where: { userId: targetUserId },
			select: { date: true },
			orderBy: { date: "asc" },
		}),
		// All-time cheat meals for goal streak
		prisma.cheatMeal.findMany({
			where: { userId: targetUserId },
			select: { date: true },
		}),
		// User goals for goal streak
		prisma.user.findUniqueOrThrow({
			where: { id: targetUserId },
			select: { weeklyWorkoutGoal: true, weeklyCheatMealBudget: true },
		}),
	]);

	// Build heatmap map directly
	const heatmapData = new Map<string, number>();
	for (const w of allWorkouts) {
		const d = new Date(w.date);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
		heatmapData.set(key, (heatmapData.get(key) ?? 0) + 1);
	}

	const { currentStreak, longestStreak } = calculateStreak(
		allTimeWorkouts.map((w) => w.date),
	);

	const goalStreak = calculateGoalStreak(
		allTimeWorkouts.map((w) => w.date),
		allTimeCheatMeals.map((c) => c.date),
		targetUserGoals.weeklyWorkoutGoal,
		targetUserGoals.weeklyCheatMealBudget,
	);

	return {
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
		isOwnProfile: session.user.id === targetUserId,
	};
}

export async function getGroupByInviteCode(inviteCode: string) {
	return prisma.group.findUnique({
		where: { inviteCode },
		include: { _count: { select: { members: true } } },
	});
}

export async function getGroupWithMembers(groupId: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect("/auth/sign-in");

	const membership = await prisma.groupMember.findUnique({
		where: { groupId_userId: { groupId, userId: session.user.id } },
	});
	if (!membership) redirect("/app/groups");

	const group = await prisma.group.findUnique({
		where: { id: groupId },
		include: {
			members: {
				include: {
					user: {
						select: { id: true, name: true, username: true, avatarUrl: true },
					},
				},
				orderBy: { joinedAt: "asc" },
			},
		},
	});
	if (!group) redirect("/app/groups");

	// Count workouts per member within challenge period
	const rangeEnd =
		new Date(group.endDate) < new Date() ? group.endDate : new Date();
	const challengeStartDate = new Date(group.startDate);
	challengeStartDate.setHours(0, 0, 0, 0);
	const workoutCounts = await prisma.gymCheck.groupBy({
		by: ["userId"],
		where: {
			userId: { in: group.members.map((m) => m.userId) },
			date: { gte: challengeStartDate, lte: rangeEnd },
		},
		_count: { id: true },
	});

	const countMap = new Map(workoutCounts.map((w) => [w.userId, w._count.id]));

	const leaderboard = group.members
		.map((m) => ({ ...m, workoutCount: countMap.get(m.userId) ?? 0 }))
		.sort((a, b) => b.workoutCount - a.workoutCount);

	return {
		group,
		leaderboard,
		currentUserId: session.user.id,
		currentUserRole: membership.role,
	};
}

export const getGroupWeeklyLeaderboard = cache(async (groupId: string) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect("/auth/sign-in");

	const group = await prisma.group.findUnique({
		where: { id: groupId },
		include: {
			members: {
				include: {
					user: {
						select: { id: true, name: true, username: true, avatarUrl: true },
					},
				},
			},
		},
	});
	if (!group) return { weeklyLeaderboard: [], lastWeekMvp: null };

	const memberIds = group.members.map((m) => m.userId);

	// Normalize group start date to beginning of day
	const challengeStartDate = new Date(group.startDate);
	challengeStartDate.setHours(0, 0, 0, 0);

	// Current week: Monday to Sunday
	const now = new Date();
	const day = now.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	const monday = new Date(now);
	monday.setDate(now.getDate() + diff);
	monday.setHours(0, 0, 0, 0);
	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);
	sunday.setHours(23, 59, 59, 999);

	// Last week
	const lastMonday = new Date(monday);
	lastMonday.setDate(monday.getDate() - 7);
	const lastSunday = new Date(monday);
	lastSunday.setDate(monday.getDate() - 1);
	lastSunday.setHours(23, 59, 59, 999);

	const weeklyStart = monday > challengeStartDate ? monday : challengeStartDate;
	const lastWeekStart = lastMonday > challengeStartDate ? lastMonday : challengeStartDate;

	const [weeklyCounts, lastWeekCounts] = await Promise.all([
		prisma.gymCheck.groupBy({
			by: ["userId"],
			where: {
				userId: { in: memberIds },
				date: { gte: weeklyStart, lte: sunday },
			},
			_count: { id: true },
		}),
		prisma.gymCheck.groupBy({
			by: ["userId"],
			where: {
				userId: { in: memberIds },
				date: { gte: lastWeekStart, lte: lastSunday },
			},
			_count: { id: true },
		}),
	]);

	const weeklyCountMap = new Map(
		weeklyCounts.map((w) => [w.userId, w._count.id]),
	);

	const weeklyLeaderboard = group.members
		.map((m) => ({
			...m,
			workoutCount: weeklyCountMap.get(m.userId) ?? 0,
		}))
		.sort((a, b) => b.workoutCount - a.workoutCount);

	// Last week MVP
	let lastWeekMvp: {
		user: { id: string; name: string; username: string | null; avatarUrl: string | null };
		workoutCount: number;
	} | null = null;

	if (lastWeekCounts.length > 0 && challengeStartDate <= lastSunday) {
		const topLastWeek = lastWeekCounts.sort(
			(a, b) => b._count.id - a._count.id,
		)[0];
		const mvpMember = group.members.find(
			(m) => m.userId === topLastWeek.userId,
		);
		if (mvpMember) {
			lastWeekMvp = {
				user: mvpMember.user,
				workoutCount: topLastWeek._count.id,
			};
		}
	}

	return { weeklyLeaderboard, lastWeekMvp };
});

export const getGroupStreakLeaderboard = cache(async (groupId: string) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect("/auth/sign-in");

	const group = await prisma.group.findUnique({
		where: { id: groupId },
		include: {
			members: {
				include: {
					user: {
						select: { id: true, name: true, username: true, avatarUrl: true },
					},
				},
			},
		},
	});
	if (!group) return [];

	// Fetch workout dates for all members (last 400 days for perf)
	const cutoff = new Date();
	cutoff.setDate(cutoff.getDate() - 400);

	const workouts = await prisma.gymCheck.findMany({
		where: {
			userId: { in: group.members.map((m) => m.userId) },
			date: { gte: cutoff },
		},
		select: { userId: true, date: true },
		orderBy: { date: "asc" },
	});

	// Group dates by userId
	const datesByUser = new Map<string, Date[]>();
	for (const w of workouts) {
		const dates = datesByUser.get(w.userId) ?? [];
		dates.push(w.date);
		datesByUser.set(w.userId, dates);
	}

	const streakLeaderboard = group.members
		.map((m) => {
			const dates = datesByUser.get(m.userId) ?? [];
			const { currentStreak, longestStreak } = calculateStreak(dates);
			return { ...m, currentStreak, longestStreak };
		})
		.sort((a, b) => b.currentStreak - a.currentStreak);

	return streakLeaderboard;
});

export const getGroupActivityFeed = cache(
	async (groupId: string, limit = 30) => {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session) redirect("/auth/sign-in");

		const group = await prisma.group.findUnique({
			where: { id: groupId },
			include: { members: { select: { userId: true } } },
		});
		if (!group) return [];

		const memberIds = group.members.map((m) => m.userId);
	const challengeStartDate = new Date(group.startDate);
	challengeStartDate.setHours(0, 0, 0, 0);

		const [workouts, milestoneNotifications] = await Promise.all([
			prisma.gymCheck.findMany({
				where: {
					userId: { in: memberIds },
					date: { gte: challengeStartDate },
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							username: true,
							avatarUrl: true,
						},
					},
					preset: { select: { label: true, color: true } },
				},
				orderBy: { createdAt: "desc" },
				take: limit,
			}),
			prisma.groupNotification.findMany({
				where: {
					groupId,
					type: { in: ["streak_milestone", "count_milestone"] },
				},
				orderBy: { createdAt: "desc" },
				take: limit,
			}),
		]);

		type FeedItem =
			| {
					kind: "workout";
					id: string;
					createdAt: Date;
					user: {
						id: string;
						name: string;
						username: string | null;
						avatarUrl: string | null;
					};
					description: string;
					presetLabel: string | null;
					presetColor: string | null;
			  }
			| {
					kind: "milestone";
					id: string;
					createdAt: Date;
					message: string;
					type: string;
			  };

		const feed: FeedItem[] = [
			...workouts.map((w) => ({
				kind: "workout" as const,
				id: w.id,
				createdAt: w.createdAt,
				user: w.user,
				description: w.description,
				presetLabel: w.preset?.label ?? null,
				presetColor: w.preset?.color ?? null,
			})),
			...milestoneNotifications.map((n) => ({
				kind: "milestone" as const,
				id: n.id,
				createdAt: n.createdAt,
				message: n.message,
				type: n.type,
			})),
		];

		feed.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

		return feed.slice(0, limit);
	},
);

export type CalendarMember = {
	id: string;
	name: string;
	username: string | null;
	avatarUrl: string | null;
};

export type GroupCalendarData = Record<string, CalendarMember[]>;

export const getGroupCalendarData = cache(async (groupId: string) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect("/auth/sign-in");

	const group = await prisma.group.findUnique({
		where: { id: groupId },
		include: { members: { select: { userId: true } } },
	});
	if (!group)
		return { calendarData: {} as GroupCalendarData, startDate: new Date(), endDate: new Date() };

	const memberIds = group.members.map((m) => m.userId);
	const rangeEnd =
		new Date(group.endDate) < new Date() ? group.endDate : new Date();

	const challengeStartDate = new Date(group.startDate);
	challengeStartDate.setHours(0, 0, 0, 0);
	const workouts = await prisma.gymCheck.findMany({
		where: {
			userId: { in: memberIds },
			date: { gte: challengeStartDate, lte: rangeEnd },
		},
		include: {
			user: {
				select: { id: true, name: true, username: true, avatarUrl: true },
			},
		},
		orderBy: { date: "asc" },
	});

	const calendarData: GroupCalendarData = {};
	for (const w of workouts) {
		const d = new Date(w.date);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
		if (!calendarData[key]) calendarData[key] = [];
		// Avoid duplicate users on the same day
		if (!calendarData[key].some((m) => m.id === w.user.id)) {
			calendarData[key].push(w.user);
		}
	}

	return { calendarData, startDate: group.startDate, endDate: group.endDate };
});

export const getGroupStreak = cache(async (groupId: string) => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect("/auth/sign-in");

	const group = await prisma.group.findUnique({
		where: { id: groupId },
		include: { members: { select: { userId: true } } },
	});
	if (!group) return { currentGroupStreak: 0, longestGroupStreak: 0 };

	const memberIds = group.members.map((m) => m.userId);
	const rangeEnd =
		new Date(group.endDate) < new Date() ? group.endDate : new Date();

	const challengeStartDate = new Date(group.startDate);
	challengeStartDate.setHours(0, 0, 0, 0);
	const workouts = await prisma.gymCheck.findMany({
		where: {
			userId: { in: memberIds },
			date: { gte: challengeStartDate, lte: rangeEnd },
		},
		select: { date: true },
		orderBy: { date: "asc" },
	});

	// Collect unique dates where at least one member trained
	const uniqueDatesSet = new Set<string>();
	for (const w of workouts) {
		const d = new Date(w.date);
		d.setHours(0, 0, 0, 0);
		uniqueDatesSet.add(d.toISOString());
	}

	const uniqueDates = Array.from(uniqueDatesSet)
		.map((iso) => new Date(iso))
		.sort((a, b) => a.getTime() - b.getTime());

	const { currentStreak, longestStreak } = calculateStreak(uniqueDates);

	return {
		currentGroupStreak: currentStreak,
		longestGroupStreak: longestStreak,
	};
});
