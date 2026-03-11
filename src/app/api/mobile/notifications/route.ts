import { getMobileSession } from "@/lib/mobile-auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const notifications = await prisma.groupNotification.findMany({
		where: { userId: userId!, read: false },
		orderBy: { createdAt: "desc" },
	});

	return Response.json(notifications);
}

export async function PUT(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const { groupId } = await request.json();

	await prisma.groupNotification.updateMany({
		where: { userId: userId!, groupId, read: false },
		data: { read: true },
	});

	return Response.json({ ok: true });
}
