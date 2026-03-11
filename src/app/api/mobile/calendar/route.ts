import { getMobileSession } from "@/lib/mobile-auth";
import prisma from "@/lib/db";

function toDateKey(date: Date) {
	const d = new Date(date);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function GET(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const { searchParams } = new URL(request.url);
	const year = Number(searchParams.get("year") ?? new Date().getFullYear());
	const startDate = new Date(year, 0, 1);
	const endDate = new Date(year, 11, 31, 23, 59, 59);

	const [gymChecks, cheatMeals] = await Promise.all([
		prisma.gymCheck.findMany({
			where: { userId: userId!, date: { gte: startDate, lte: endDate } },
			select: { id: true, description: true, presetId: true, date: true },
		}),
		prisma.cheatMeal.findMany({
			where: { userId: userId!, date: { gte: startDate, lte: endDate } },
			select: { id: true, name: true, presetId: true, date: true },
		}),
	]);

	const gymChecksByDate: Record<string, { id: string; description: string; presetId: string | null }[]> = {};
	for (const g of gymChecks) {
		const key = toDateKey(g.date);
		if (!gymChecksByDate[key]) gymChecksByDate[key] = [];
		gymChecksByDate[key].push({ id: g.id, description: g.description, presetId: g.presetId });
	}

	const cheatMealsByDate: Record<string, { id: string; name: string; presetId: string | null }[]> = {};
	for (const m of cheatMeals) {
		const key = toDateKey(m.date);
		if (!cheatMealsByDate[key]) cheatMealsByDate[key] = [];
		cheatMealsByDate[key].push({ id: m.id, name: m.name, presetId: m.presetId });
	}

	return Response.json({ gymChecks: gymChecksByDate, cheatMeals: cheatMealsByDate });
}
