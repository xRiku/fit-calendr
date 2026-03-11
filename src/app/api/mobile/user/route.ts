import { getMobileSession } from "@/lib/mobile-auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const user = await prisma.user.findUniqueOrThrow({
		where: { id: userId! },
		select: {
			id: true,
			email: true,
			name: true,
			username: true,
			weeklyWorkoutGoal: true,
			weeklyCheatMealBudget: true,
			avatarUrl: true,
		},
	});

	return Response.json(user);
}

export async function PUT(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const { name, username, weeklyWorkoutGoal, weeklyCheatMealBudget } = await request.json();

	const user = await prisma.user.update({
		where: { id: userId! },
		data: {
			...(name !== undefined && { name }),
			...(username !== undefined && { username }),
			...(weeklyWorkoutGoal !== undefined && { weeklyWorkoutGoal }),
			...(weeklyCheatMealBudget !== undefined && { weeklyCheatMealBudget }),
		},
		select: {
			id: true,
			email: true,
			name: true,
			username: true,
			weeklyWorkoutGoal: true,
			weeklyCheatMealBudget: true,
			avatarUrl: true,
		},
	});

	return Response.json(user);
}
