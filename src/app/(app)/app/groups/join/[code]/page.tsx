import { getGroupByInviteCode } from "@/lib/server-utils";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { joinGroupByCode } from "@/actions/group-actions";
import db from "@/lib/db";
import { isPast, format, formatDistanceToNow } from "date-fns";
import { Trophy, Users, CalendarDays } from "lucide-react";
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

	// If already a member, redirect straight to group
	if (session) {
		const { alreadyMember } = await joinGroupByCode(code).catch(() => ({ alreadyMember: false }));
		// joinGroupByCode throws if ended, so only redirect if they're already a member
		const existingCheck = await db.groupMember.findUnique({
			where: { groupId_userId: { groupId: group.id, userId: session.user.id } },
		});
		if (existingCheck) redirect(`/app/groups/${group.id}`);
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
					<p className="text-muted-foreground text-sm">This challenge has ended.</p>
				) : (
					<p className="text-muted-foreground text-sm">
						You've been invited to join a fitness challenge group.
					</p>
				)}
			</div>

			<div className="flex flex-col gap-2 w-full rounded-xl border border-border bg-card px-5 py-4 text-sm">
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground flex items-center gap-2">
						<Users className="size-4" /> Members
					</span>
					<span className="font-medium">{group._count.members}</span>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground flex items-center gap-2">
						<CalendarDays className="size-4" /> {ended ? "Ended" : "Ends"}
					</span>
					<span className="font-medium">
						{format(new Date(group.endDate), "MMM d, yyyy")}
					</span>
				</div>
				{!ended && (
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">Time left</span>
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
