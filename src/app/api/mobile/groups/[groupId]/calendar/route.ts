import { getMobileSession } from "@/lib/mobile-auth";
import { filterRetroactiveChecks } from "@/lib/core-utils";
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
		include: { members: { select: { userId: true } } },
	});
	if (!group) return Response.json({ error: "Not found" }, { status: 404 });

	const memberIds = group.members.map((m) => m.userId);
	const challengeStartDate = new Date(group.startDate);
	challengeStartDate.setHours(0, 0, 0, 0);
	const rangeEnd = new Date(group.endDate) < new Date() ? group.endDate : new Date();

	const workouts = await prisma.gymCheck.findMany({
		where: {
			userId: { in: memberIds },
			date: { gte: challengeStartDate, lte: rangeEnd },
		},
		include: {
			user: { select: { id: true, name: true, username: true, avatarUrl: true } },
		},
		orderBy: { date: "asc" },
	});

	const filtered = filterRetroactiveChecks(workouts, group.allowRetroactiveWorkouts);

	const calendarData: Record<string, { id: string; name: string; username: string | null; avatarUrl: string | null }[]> = {};
	for (const w of filtered) {
		const d = new Date(w.date);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
		if (!calendarData[key]) calendarData[key] = [];
		if (!calendarData[key].some((m) => m.id === w.user.id)) {
			calendarData[key].push(w.user);
		}
	}

	return Response.json({ calendarData, startDate: group.startDate, endDate: group.endDate });
}
