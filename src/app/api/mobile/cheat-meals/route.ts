import { getMobileSession } from "@/lib/mobile-auth";
import prisma from "@/lib/db";

export async function POST(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const body = await request.json();
	const { date, cheatMeals } = body as {
		date: string;
		cheatMeals: { name: string; presetId?: string }[];
	};

	const dateObj = new Date(date);

	const created = await prisma.cheatMeal.createMany({
		data: cheatMeals.map((m) => ({
			name: m.name,
			date: dateObj,
			userId: userId!,
			presetId: m.presetId ?? null,
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
		add: { name: string; presetId?: string }[];
	};

	const dateObj = new Date(date);
	const startOfDay = new Date(dateObj);
	startOfDay.setHours(0, 0, 0, 0);
	const endOfDay = new Date(dateObj);
	endOfDay.setHours(23, 59, 59, 999);

	await prisma.cheatMeal.deleteMany({
		where: {
			userId: userId!,
			date: { gte: startOfDay, lte: endOfDay },
			id: { notIn: keep },
		},
	});

	if (add.length > 0) {
		await prisma.cheatMeal.createMany({
			data: add.map((m) => ({
				name: m.name,
				date: dateObj,
				userId: userId!,
				presetId: m.presetId ?? null,
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

	await prisma.cheatMeal.deleteMany({
		where: { id, userId: userId! },
	});

	return Response.json({ ok: true });
}
