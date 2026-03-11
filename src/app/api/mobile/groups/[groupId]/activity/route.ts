import { getMobileSession } from "@/lib/mobile-auth";
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

	const workouts = await prisma.gymCheck.findMany({
		where: {
			userId: { in: memberIds },
			date: { gte: challengeStartDate },
		},
		include: {
			user: { select: { id: true, name: true, username: true, avatarUrl: true } },
			preset: { select: { label: true, color: true } },
		},
		orderBy: { createdAt: "desc" },
		take: 50,
	});

	const feed = workouts.map((w) => ({
		id: w.id,
		userId: w.userId,
		username: w.user.username,
		name: w.user.name,
		avatarUrl: w.user.avatarUrl,
		date: w.date,
		description: w.description,
		presetLabel: w.preset?.label ?? null,
		presetColor: w.preset?.color ?? null,
		createdAt: w.createdAt,
	}));

	return Response.json(feed);
}
