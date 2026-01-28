"use server";

import { auth } from "@/lib/auth";
// import { auth, signIn, signOut } from "@/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function addDayInfo({
	formData,
	date,
}: {
	formData: FormData;
	date: Date;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return;
	}

	let cheatMealResponse = undefined;
	let gymCheckResponse = undefined;

	if (formData.get("cheatMealName")) {
		cheatMealResponse = await prisma.cheatMeal.create({
			data: {
				name: formData.get("cheatMealName") as string,
				date: date,
				user: {
					connect: {
						id: session.user.id,
					},
				},
			},
		});
	}

	if (formData.get("workoutDescription")) {
		gymCheckResponse = await prisma.gymCheck.create({
			data: {
				description: formData.get("workoutDescription") as string,
				date,
				user: {
					connect: {
						id: session.user.id,
					},
				},
			},
		});
	}

	revalidatePath("/app/calendar", "page");
	return {
		cheatMealResponse,
		gymCheckResponse,
	};
}

export async function updateCheatMealInfo({
	userId,
	cheatMealName,
	cheatMealId,
	date,
}: {
	userId: string;
	cheatMealName?: string;
	cheatMealId?: string;
	date: Date;
}) {
	if (!cheatMealId && cheatMealName !== "") {
		await prisma.cheatMeal.create({
			data: {
				name: cheatMealName as string,
				date: date,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});
	}

	if (cheatMealId) {
		const existingCheatMeal = await prisma.cheatMeal.findUnique({
			where: {
				id: cheatMealId,
			},
			select: {
				id: true,
			},
		});

		if (!existingCheatMeal) {
			throw new Error(
				`Cheat Meal with specified id: ${cheatMealId} does not exist.`,
			);
		}
		if (cheatMealName === "") {
			return await prisma.cheatMeal.delete({
				where: {
					id: cheatMealId,
				},
			});
		}

		return await prisma.cheatMeal.update({
			data: {
				name: cheatMealName,
			},
			where: {
				id: cheatMealId,
			},
		});
	}
}

export async function updateGymCheckInfo({
	userId,
	workoutDescription,
	gymCheckId,
	date,
}: {
	userId: string;
	workoutDescription?: string;
	gymCheckId?: string;
	date: Date;
}) {
	if (!gymCheckId && workoutDescription !== "") {
		return await prisma.gymCheck.create({
			data: {
				description: workoutDescription as string,
				date: date,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});
	}

	if (gymCheckId) {
		const existingGymCheck = await prisma.gymCheck.findUnique({
			where: {
				id: gymCheckId,
			},
			select: {
				id: true,
			},
		});

		if (!existingGymCheck) {
			throw new Error(
				`Gym check with specified id: ${gymCheckId} does not exist.`,
			);
		}
		if (workoutDescription === "") {
			return await prisma.gymCheck.delete({
				where: {
					id: gymCheckId,
				},
			});
		}
		return await prisma.gymCheck.update({
			data: {
				description: workoutDescription,
			},
			where: {
				id: gymCheckId,
			},
		});
	}
}

export async function updateDayInfo({
	gymCheckId,
	cheatMealId,
	cheatMealName,
	workoutDescription,
	date,
}: {
	gymCheckId?: string;
	cheatMealId?: string;
	cheatMealName?: string;
	workoutDescription?: string;
	date: Date;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return;
	}

	let cheatMealResponse = undefined;
	let gymCheckResponse = undefined;

	if (cheatMealName !== undefined) {
		cheatMealResponse = await updateCheatMealInfo({
			userId: session.user.id,
			cheatMealId,
			cheatMealName,
			date: date,
		});
	}

	if (workoutDescription !== undefined) {
		gymCheckResponse = await updateGymCheckInfo({
			userId: session.user.id,
			gymCheckId,
			workoutDescription,
			date: date,
		});
	}

	revalidatePath("/app/calendar", "page");

	return {
		cheatMealResponse,
		gymCheckResponse,
	};
}

/* export async function deleteCheatMeal(id: string) {
  const existingCheatMeal = await prisma.cheatMeal.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingCheatMeal) {
    throw new Error(`Cheat Meal with specified id: ${id} does not exist.`);
  }

  await prisma.cheatMeal.delete({
    where: {
      id,
    },
  });
}  */

export async function updateUserName({
	name,
	userId,
}: {
	name: string;
	userId: string;
}) {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		throw Error(`User with id ${userId} doesn't exist`);
	}

	return await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			name,
		},
	});
}

// Auth

export async function signInWithCredentials(email: string) {
	await auth.api.sendVerificationOTP({
		body: {
			email: email,
			type: "sign-in",
		},
	});
}

export async function verifyOtp(email: string, otp: string) {
	return await auth.api.signInEmailOTP({
		body: {
			email,
			otp,
		},
	});
}

export async function logOut() {
	await auth.api.signOut({
		headers: await headers(),
	});
	redirect("/auth/sign-in");
}
