// Pure utility functions with no Next.js / server-only dependencies.
// Importable from both server-utils.ts and API route handlers.

type HasDate = { date: Date };

export function groupByMonth<T extends HasDate>(
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

export function filterRetroactiveChecks<T extends { date: Date; createdAt: Date }>(
	checks: T[],
	allow: boolean,
): T[] {
	if (allow) return checks;
	return checks.filter((c) => {
		const d = new Date(c.date);
		d.setHours(0, 0, 0, 0);
		const cr = new Date(c.createdAt);
		cr.setHours(0, 0, 0, 0);
		return d >= cr;
	});
}

export function countFiltered(
	checks: { userId: string; date: Date; createdAt: Date }[],
	allow: boolean,
): Map<string, number> {
	const map = new Map<string, number>();
	for (const c of checks) {
		if (!allow) {
			const d = new Date(c.date);
			d.setHours(0, 0, 0, 0);
			const cr = new Date(c.createdAt);
			cr.setHours(0, 0, 0, 0);
			if (d < cr) continue;
		}
		map.set(c.userId, (map.get(c.userId) ?? 0) + 1);
	}
	return map;
}

export function calculateStreak(dates: Date[]): {
	currentStreak: number;
	longestStreak: number;
} {
	if (dates.length === 0) {
		return { currentStreak: 0, longestStreak: 0 };
	}

	const sortedDates = dates
		.map((d) => new Date(d))
		.sort((a, b) => a.getTime() - b.getTime());

	const normalizeDate = (date: Date) => {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		return d.getTime();
	};

	const today = normalizeDate(new Date());

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

export function calculateGoalStreak(
	gymCheckDates: Date[],
	cheatMealDates: Date[],
	weeklyWorkoutGoal: number,
	weeklyCheatMealBudget: number,
): { currentGoalStreak: number; longestGoalStreak: number } {
	if (weeklyWorkoutGoal <= 0) return { currentGoalStreak: 0, longestGoalStreak: 0 };

	const now = new Date();
	const day = now.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	const currentMonday = new Date(now);
	currentMonday.setDate(now.getDate() + diff);
	currentMonday.setHours(0, 0, 0, 0);

	const allDates = [...gymCheckDates, ...cheatMealDates].map((d) => new Date(d));
	if (allDates.length === 0) return { currentGoalStreak: 0, longestGoalStreak: 0 };
	const earliestEntry = new Date(Math.min(...allDates.map((d) => d.getTime())));

	const countInRange = (dates: Date[], start: Date, end: Date) =>
		dates.filter((d) => {
			const t = new Date(d).getTime();
			return t >= start.getTime() && t <= end.getTime();
		}).length;

	let currentGoalStreak = 0;
	let longestGoalStreak = 0;
	let consecutiveRun = 0;
	let foundFirstNonPerfect = false;

	let weekMonday = new Date(currentMonday);
	weekMonday.setDate(currentMonday.getDate() - 7);

	while (weekMonday >= earliestEntry || weekMonday.getTime() >= earliestEntry.getTime()) {
		const weekSunday = new Date(weekMonday);
		weekSunday.setDate(weekMonday.getDate() + 6);
		weekSunday.setHours(23, 59, 59, 999);

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
