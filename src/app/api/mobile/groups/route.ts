import { getMobileSession } from "@/lib/mobile-auth";
import prisma from "@/lib/db";

function generateInviteCode() {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let code = "";
	for (let i = 0; i < 8; i++) {
		code += chars[Math.floor(Math.random() * chars.length)];
	}
	return code;
}

function resolveEndDate(duration: string | { custom: { end: string } }): Date {
	const now = new Date();
	if (typeof duration === "string") {
		switch (duration) {
			case "30d": {
				const d = new Date(now);
				d.setDate(d.getDate() + 30);
				return d;
			}
			case "90d": {
				const d = new Date(now);
				d.setDate(d.getDate() + 90);
				return d;
			}
			case "6m": {
				const d = new Date(now);
				d.setMonth(d.getMonth() + 6);
				return d;
			}
			case "eoy": {
				return new Date(now.getFullYear(), 11, 31, 23, 59, 59);
			}
			case "1y": {
				const d = new Date(now);
				d.setFullYear(d.getFullYear() + 1);
				return d;
			}
		}
	} else if (duration && typeof duration === "object" && "custom" in duration) {
		return new Date(duration.custom.end);
	}
	// Fallback: 30 days
	const d = new Date(now);
	d.setDate(d.getDate() + 30);
	return d;
}

export async function GET(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const memberships = await prisma.groupMember.findMany({
		where: { userId: userId! },
		include: {
			group: {
				include: { _count: { select: { members: true } } },
			},
		},
		orderBy: { joinedAt: "desc" },
	});

	const groups = memberships.map((m) => ({
		...m.group,
		role: m.role,
	}));

	return Response.json(groups);
}

export async function POST(request: Request) {
	const { userId, error } = await getMobileSession(request);
	if (error) return error;

	const { name, description, duration } = await request.json();

	let inviteCode = generateInviteCode();
	// Ensure uniqueness
	while (await prisma.group.findUnique({ where: { inviteCode } })) {
		inviteCode = generateInviteCode();
	}

	const endDate = resolveEndDate(duration);

	const group = await prisma.group.create({
		data: {
			name,
			description: description ?? null,
			inviteCode,
			ownerId: userId!,
			endDate,
			members: {
				create: { userId: userId!, role: "owner" },
			},
		},
		include: { _count: { select: { members: true } } },
	});

	return Response.json({ ...group, role: "owner" });
}
