import { getMobileSession } from "@/lib/mobile-auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const presets = await prisma.workoutPreset.findMany({
		where: { userId: userId! },
		orderBy: { order: "asc" },
	});

	return Response.json(presets);
}

export async function POST(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const { label, color } = await request.json();

	const maxOrder = await prisma.workoutPreset.aggregate({
		where: { userId: userId! },
		_max: { order: true },
	});
	const nextOrder = (maxOrder._max.order ?? -1) + 1;

	const preset = await prisma.workoutPreset.create({
		data: { label, color, order: nextOrder, userId: userId! },
	});

	return Response.json(preset);
}

export async function PUT(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const { id, label, color, order } = await request.json();

	const preset = await prisma.workoutPreset.updateMany({
		where: { id, userId: userId! },
		data: {
			...(label !== undefined && { label }),
			...(color !== undefined && { color }),
			...(order !== undefined && { order }),
		},
	});

	return Response.json(preset);
}

export async function DELETE(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");
	if (!id) return Response.json({ error: "id is required" }, { status: 400 });

	// Null out presetId on related GymChecks
	await prisma.gymCheck.updateMany({
		where: { presetId: id, userId: userId! },
		data: { presetId: null },
	});

	await prisma.workoutPreset.deleteMany({ where: { id, userId: userId! } });

	return Response.json({ ok: true });
}
