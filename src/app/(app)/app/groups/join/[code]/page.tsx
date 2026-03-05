import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { getGroupByInviteCode } from "@/lib/server-utils";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { CalendarDays, Trophy, Users } from "lucide-react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { JoinGroupButton } from "./join-group-button";

interface Props {
	params: Promise<{ code: string }>;
}

export default async function JoinGroupPage({ params }: Props) {
	const { code } = await params;
	const group = await getGroupByInviteCode(code);

	if (!group) notFound();

	const session = await auth.api.getSession({ headers: await headers() });
	const ended = isPast(new Date(group.endDate));

	// If already a member, redirect straight to group (read-only check — no writes during render)
	if (session) {
		const existingMembership = await db.groupMember.findUnique({
			where: { groupId_userId: { groupId: group.id, userId: session.user.id } },
		});
		if (existingMembership) redirect(`/app/groups/${group.id}`);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 max-w-sm mx-auto text-center">
			{ended ? (
				<Trophy className="size-10 text-yellow-400" />
			) : (
				<div className="size-14 rounded-full bg-vibrant-green/20 flex items-center justify-center">
					<Users className="size-7 text-vibrant-green" />
				</div>
			)}

			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold">{group.name}</h1>
				{ended ? (
					<p className="text-muted-foreground text-sm">
						Este desafio terminou.
					</p>
				) : (
					<p className="text-muted-foreground text-sm">
						Você foi convidado para participar de um grupo de desafio fitness.
					</p>
				)}
			</div>

			<div className="flex flex-col gap-2 w-full rounded-xl border border-border bg-card px-5 py-4 text-sm">
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground flex items-center gap-2">
						<Users className="size-4" /> Membros
					</span>
					<span className="font-medium">{group._count.members}</span>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground flex items-center gap-2">
						<CalendarDays className="size-4" /> {ended ? "Terminou" : "Termina"}
					</span>
					<span className="font-medium">
						{format(new Date(group.endDate), "dd MMM yyyy")}
					</span>
				</div>
				{!ended && (
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">Tempo restante</span>
						<span className="font-medium text-vibrant-green">
							{formatDistanceToNow(new Date(group.endDate))}
						</span>
					</div>
				)}
			</div>

			{!ended && <JoinGroupButton inviteCode={code} groupId={group.id} />}
		</div>
	);
}
