import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Calendars from "./calendars";

async function getCalendarData() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/auth/sign-in");
	}

	const [gymChecks, cheatMeals] = await Promise.all([
		prisma.gymCheck.findMany({
			where: {
				userId: session.user.id,
			},
			include: {
				preset: {
					select: {
						id: true,
						label: true,
						color: true,
					},
				},
			},
		}),
		prisma.cheatMeal.findMany({
			where: {
				userId: session.user.id,
			},
			include: {
				preset: {
					select: {
						id: true,
						label: true,
						color: true,
					},
				},
			},
		}),
	]);

	return { gymChecks, cheatMeals };
}

export default async function CalendarDataProvider({
	autoOpenAdd = false,
}: {
	autoOpenAdd?: boolean;
}) {
	const { gymChecks, cheatMeals } = await getCalendarData();

	return (
		<Calendars
			gymChecks={gymChecks}
			cheatMeals={cheatMeals}
			autoOpenAdd={autoOpenAdd}
		/>
	);
}
