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

	const existing = await prisma.user.findUnique({ where: { username: trimmed } });
	if (existing && existing.id !== session.user.id) {
		throw new Error("That username is already taken.");
	}

	await prisma.user.update({
		where: { id: session.user.id },
		data: { username: trimmed },
	});

	revalidatePath("/app/account");
}
