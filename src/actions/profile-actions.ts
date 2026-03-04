"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const USERNAME_REGEX = /^[a-z0-9-]{3,30}$/;

export async function updateUsername(username: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("Unauthorized");

	const trimmed = username.trim().toLowerCase();

	if (!USERNAME_REGEX.test(trimmed)) {
		throw new Error(
			"Username must be 3–30 characters and contain only lowercase letters, numbers, and hyphens.",
		);
	}

	try {
		await prisma.user.update({
			where: { id: session.user.id },
			data: { username: trimmed },
		});
	} catch (e) {
		// Prisma unique constraint violation code
		if (
			typeof e === "object" &&
			e !== null &&
			"code" in e &&
			(e as { code: string }).code === "P2002"
		) {
			throw new Error("That username is already taken.");
		}
		throw e;
	}

	revalidatePath("/app/account");
}
