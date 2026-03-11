import { getMobileSession } from "@/lib/mobile-auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const { searchParams } = new URL(request.url);
	const dateParam = searchParams.get("date");
	if (!dateParam) {
		return Response.json({ error: "date is required" }, { status: 400 });
	}

	const date = new Date(dateParam);
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);
	const endOfDay = new Date(date);
	endOfDay.setHours(23, 59, 59, 999);

	const [gymChecks, cheatMeals] = await Promise.all([
		prisma.gymCheck.findMany({
			where: { userId: userId!, date: { gte: startOfDay, lte: endOfDay } },
			select: { id: true, description: true, presetId: true, date: true, createdAt: true },
		}),
		prisma.cheatMeal.findMany({
			where: { userId: userId!, date: { gte: startOfDay, lte: endOfDay } },
			select: { id: true, name: true, presetId: true, date: true, createdAt: true },
		}),
	]);

	return Response.json({ gymChecks, cheatMeals });
}
