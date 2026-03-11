"use server";

import { randomBytes } from "crypto";
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
			if (!customEndDate)
				throw new Error("Data final personalizada é obrigatória");
			return customEndDate;
	}
}

export async function createGroup({
	name,
	description,
	duration,
	customEndDate,
	allowRetroactiveWorkouts = true,
}: {
	name: string;
	description?: string;
	duration: GroupDuration;
	customEndDate?: Date;
	allowRetroactiveWorkouts?: boolean;
}) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("Não autorizado");

	const endDate = computeEndDate(duration, customEndDate);

	const trimmedDescription = description?.trim().slice(0, 280) || null;

	const inviteCode = randomBytes(6).toString("base64url").slice(0, 8);
	const group = await prisma.group.create({
		data: {
			name: name.trim(),
			description: trimmedDescription,
			ownerId: session.user.id,
			endDate,
			inviteCode,
			allowRetroactiveWorkouts,
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
	if (!session) throw new Error("Não autorizado");

	const group = await prisma.group.findUnique({ where: { inviteCode } });
	if (!group) throw new Error("Grupo não encontrado");

	if (new Date() > group.endDate) throw new Error("Este desafio já encerrou");

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
	if (!session) throw new Error("Não autorizado");

	const member = await prisma.groupMember.findUnique({
		where: { groupId_userId: { groupId, userId: session.user.id } },
	});
	if (!member) throw new Error("Não é membro");
	if (member.role === "owner")
		throw new Error("O dono não pode sair — exclua o grupo");

	await prisma.groupMember.delete({
		where: { groupId_userId: { groupId, userId: session.user.id } },
	});

	revalidatePath("/app/groups");
}

export async function deleteGroup(groupId: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("Não autorizado");

	const group = await prisma.group.findUnique({ where: { id: groupId } });
	if (!group) throw new Error("Grupo não encontrado");
	if (group.ownerId !== session.user.id)
		throw new Error("Apenas o dono pode excluir este grupo");

	await prisma.group.delete({ where: { id: groupId } });

	revalidatePath("/app/groups");
}

export async function updateGroupName(groupId: string, name: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("Não autorizado");

	const group = await prisma.group.findUnique({ where: { id: groupId } });
	if (!group) throw new Error("Grupo não encontrado");
	if (group.ownerId !== session.user.id)
		throw new Error("Apenas o dono pode renomear este grupo");

	await prisma.group.update({
		where: { id: groupId },
		data: { name: name.trim() },
	});

	revalidatePath(`/app/groups/${groupId}`);
}

export async function updateGroupDescription(
	groupId: string,
	description: string,
): Promise<{ error?: string }> {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user?.id) return { error: "Não autorizado" };

	const group = await prisma.group.findUnique({ where: { id: groupId } });
	if (!group || group.ownerId !== session.user.id)
		return { error: "Sem permissão" };

	const trimmed = description.trim().slice(0, 280);
	await prisma.group.update({
		where: { id: groupId },
		data: { description: trimmed || null },
	});

	revalidatePath(`/app/groups/${groupId}`);
	return {};
}

export async function updateGroupEndDate(groupId: string, newEndDate: Date) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("Não autorizado");

	const group = await prisma.group.findUnique({
		where: { id: groupId },
		include: { members: { select: { userId: true } } },
	});
	if (!group) throw new Error("Grupo não encontrado");
	if (group.ownerId !== session.user.id)
		throw new Error("Apenas o dono pode alterar a data final");

	const formattedDate = new Intl.DateTimeFormat("pt-BR", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(newEndDate);

	const memberIds = group.members
		.map((m) => m.userId)
		.filter((id) => id !== session.user.id);

	await prisma.$transaction([
		prisma.group.update({
			where: { id: groupId },
			data: { endDate: newEndDate },
		}),
		...memberIds.map((userId) =>
			prisma.groupNotification.create({
				data: {
					groupId,
					userId,
					type: "end_date_changed",
					message: `A data final de "${group.name}" foi alterada para ${formattedDate}.`,
				},
			}),
		),
	]);

	revalidatePath(`/app/groups/${groupId}`);
}

export async function regenerateInviteCode(groupId: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("Não autorizado");

	const group = await prisma.group.findUnique({ where: { id: groupId } });
	if (!group) throw new Error("Grupo não encontrado");
	if (group.ownerId !== session.user.id)
		throw new Error("Apenas o dono pode regenerar o código de convite");

	const newCode = randomBytes(6).toString("base64url").slice(0, 8);
	const updated = await prisma.group.update({
		where: { id: groupId },
		data: { inviteCode: newCode },
	});

	revalidatePath(`/app/groups/${groupId}`);
	return updated.inviteCode;
}

export async function markNotificationsRead(notificationIds: string[]) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw new Error("Não autorizado");

	await prisma.groupNotification.updateMany({
		where: { id: { in: notificationIds }, userId: session.user.id },
		data: { read: true },
	});
}

export async function updateGroupAllowRetroactiveWorkouts(
	groupId: string,
	allowRetroactiveWorkouts: boolean,
): Promise<{ error?: string }> {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user?.id) return { error: "Não autorizado" };

	const group = await prisma.group.findUnique({ where: { id: groupId } });
	if (!group || group.ownerId !== session.user.id)
		return { error: "Sem permissão" };

	await prisma.group.update({
		where: { id: groupId },
		data: { allowRetroactiveWorkouts },
	});

	revalidatePath(`/app/groups/${groupId}`);
	return {};
}

export async function getUnreadGroupNotifications() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) return [];

	return prisma.groupNotification.findMany({
		where: { userId: session.user.id, read: false },
		orderBy: { createdAt: "desc" },
	});
}
