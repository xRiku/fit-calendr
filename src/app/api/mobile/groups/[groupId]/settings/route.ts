import { getMobileSession } from "@/lib/mobile-auth";
import prisma from "@/lib/db";

function generateInviteCode() {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let code = "";
	for (let i = 0; i < 8; i++) {
		code += chars[Math.floor(Math.random() * chars.length)];
	}
	return code;
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ groupId: string }> },
) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const { groupId } = await params;

	const group = await prisma.group.findUnique({ where: { id: groupId } });
	if (!group) return Response.json({ error: "Not found" }, { status: 404 });
	if (group.ownerId !== userId) return Response.json({ error: "Forbidden" }, { status: 403 });

	const { name, description, endDate, allowRetroactiveWorkouts, regenerateCode } =
		await request.json();

	let inviteCode = group.inviteCode;
	if (regenerateCode) {
		inviteCode = generateInviteCode();
		while (await prisma.group.findFirst({ where: { inviteCode, id: { not: groupId } } })) {
			inviteCode = generateInviteCode();
		}
	}

	const updated = await prisma.group.update({
		where: { id: groupId },
		data: {
			...(name !== undefined && { name }),
			...(description !== undefined && { description }),
			...(endDate !== undefined && { endDate: new Date(endDate) }),
			...(allowRetroactiveWorkouts !== undefined && { allowRetroactiveWorkouts }),
			inviteCode,
		},
	});

	return Response.json(updated);
}
