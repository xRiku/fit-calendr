import { getMobileSession } from "@/lib/mobile-auth";
import prisma from "@/lib/db";

export async function POST(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const { inviteCode } = await request.json();

	const group = await prisma.group.findUnique({ where: { inviteCode } });
	if (!group) {
		return Response.json({ error: "Invalid invite code" }, { status: 404 });
	}

	// Check if already a member
	const existing = await prisma.groupMember.findUnique({
		where: { groupId_userId: { groupId: group.id, userId: userId! } },
	});
	if (existing) {
		return Response.json({ error: "Already a member" }, { status: 409 });
	}

	await prisma.groupMember.create({
		data: { groupId: group.id, userId: userId!, role: "member" },
	});

	// Notify existing members
	const members = await prisma.groupMember.findMany({
		where: { groupId: group.id, userId: { not: userId! } },
		select: { userId: true },
	});

	const joiner = await prisma.user.findUnique({
		where: { id: userId! },
		select: { name: true, username: true },
	});

	if (members.length > 0 && joiner) {
		await prisma.groupNotification.createMany({
			data: members.map((m) => ({
				groupId: group.id,
				userId: m.userId,
				type: "member_joined",
				message: `${joiner.name} joined ${group.name}`,
			})),
		});
	}

	return Response.json({ ...group, role: "member" });
}
