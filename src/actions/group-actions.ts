"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { addDays, addMonths, addYears, endOfYear } from "date-fns";

export type GroupDuration = "30d" | "90d" | "6m" | "eoy" | "1y" | "custom";

function computeEndDate(duration: GroupDuration, customEndDate?: Date): Date {
	const now = new Date();
	switch (duration) {
		case "30d":
			return addDays(now, 30);
		case "90d":
			return addDays(now, 90);
		case "6m":
			return addMonths(now, 6);
		case "eoy":
			return endOfYear(now);
		case "1y":
			return addYears(now, 1);
		case "custom":
			if (!customEndDate) throw new Error("Custom end date required");
			return customEndDate;
	}
}

export async function createGroup({
	name,
	duration,
	customEndDate,
}: {
	name: string;
	duration: GroupDuration;
	customEndDate?: Date;
}) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("Unauthorized");

	const endDate = computeEndDate(duration, customEndDate);

	const group = await prisma.group.create({
		data: {
			name: name.trim(),
			ownerId: session.user.id,
			endDate,
			members: {
				create: {
					userId: session.user.id,
					role: "owner",
				},
			},
		},
	});

	revalidatePath("/app/groups");
	return group;
}

export async function joinGroupByCode(inviteCode: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("Unauthorized");

	const group = await prisma.group.findUnique({ where: { inviteCode } });
	if (!group) throw new Error("Group not found");

	if (new Date() > group.endDate) throw new Error("This challenge has ended");

	const existing = await prisma.groupMember.findUnique({
		where: { groupId_userId: { groupId: group.id, userId: session.user.id } },
	});
	if (existing) return { group, alreadyMember: true };

	await prisma.groupMember.create({
		data: { groupId: group.id, userId: session.user.id, role: "member" },
	});

	revalidatePath("/app/groups");
	return { group, alreadyMember: false };
}

export async function leaveGroup(groupId: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("Unauthorized");

	const member = await prisma.groupMember.findUnique({
		where: { groupId_userId: { groupId, userId: session.user.id } },
	});
	if (!member) throw new Error("Not a member");
	if (member.role === "owner") throw new Error("Owner cannot leave — delete the group instead");

	await prisma.groupMember.delete({
		where: { groupId_userId: { groupId, userId: session.user.id } },
	});

	revalidatePath("/app/groups");
}

export async function deleteGroup(groupId: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("Unauthorized");

	const group = await prisma.group.findUnique({ where: { id: groupId } });
	if (!group) throw new Error("Group not found");
	if (group.ownerId !== session.user.id) throw new Error("Only the owner can delete this group");

	await prisma.group.delete({ where: { id: groupId } });

	revalidatePath("/app/groups");
}
