import { getMobileSession } from "@/lib/mobile-auth";
import prisma from "@/lib/db";

export async function POST(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const body = await request.json();
	const { date, workouts } = body as {
		date: string;
		workouts: { description: string; presetId?: string }[];
	};

	const dateObj = new Date(date);

	const created = await prisma.gymCheck.createMany({
		data: workouts.map((w) => ({
			description: w.description,
			date: dateObj,
			userId: userId!,
			presetId: w.presetId ?? null,
		})),
	});

	return Response.json({ count: created.count });
}

export async function PUT(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const body = await request.json();
	const { date, keep, add } = body as {
		date: string;
		keep: string[];
		add: { description: string; presetId?: string }[];
	};

	const dateObj = new Date(date);
	const startOfDay = new Date(dateObj);
	startOfDay.setHours(0, 0, 0, 0);
	const endOfDay = new Date(dateObj);
	endOfDay.setHours(23, 59, 59, 999);

	// Delete workouts not in keep list
	await prisma.gymCheck.deleteMany({
		where: {
			userId: userId!,
			date: { gte: startOfDay, lte: endOfDay },
			id: { notIn: keep },
		},
	});

	// Create new workouts
	if (add.length > 0) {
		await prisma.gymCheck.createMany({
			data: add.map((w) => ({
				description: w.description,
				date: dateObj,
				userId: userId!,
				presetId: w.presetId ?? null,
			})),
		});
	}

	return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const body = await request.json();
	const { id } = body as { id: string };

	await prisma.gymCheck.deleteMany({
		where: { id, userId: userId! },
	});

	return Response.json({ ok: true });
}
