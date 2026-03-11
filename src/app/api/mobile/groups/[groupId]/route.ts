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
	if (!membership) {
		return Response.json({ error: "Not a member" }, { status: 403 });
	}

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
	if (!group) return Response.json({ error: "Not found" }, { status: 404 });

	return Response.json({ ...group, currentUserRole: membership.role });
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ groupId: string }> },
) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const { groupId } = await params;

	const group = await prisma.group.findUnique({ where: { id: groupId } });
	if (!group) return Response.json({ error: "Not found" }, { status: 404 });
	if (group.ownerId !== userId) {
		return Response.json({ error: "Forbidden" }, { status: 403 });
	}

	await prisma.group.delete({ where: { id: groupId } });

	return Response.json({ ok: true });
}
