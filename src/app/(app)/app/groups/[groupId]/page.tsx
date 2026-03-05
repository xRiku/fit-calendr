import { getGroupWithMembers } from "@/lib/server-utils";
import { notFound } from "next/navigation";
import { isPast, formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trophy, Users, CalendarDays, Medal, ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GroupSettingsDialog } from "./group-settings-dialog";
import { LeaveGroupButton } from "./leave-group-button";
import { CopyInviteButton } from "./copy-invite-button";
import { cn, getInitials } from "@/lib/utils";
import { env } from "@/env";
import Link from "next/link";

interface Props {
	params: Promise<{ groupId: string }>;
}

function RankIcon({ rank }: { rank: number }) {
	if (rank === 1) return <Trophy className="size-4 text-yellow-400" />;
	if (rank === 2) return <Medal className="size-4 text-neutral-400" />;
	if (rank === 3) return <Medal className="size-4 text-amber-600" />;
	return (
		<span className="text-sm font-medium text-muted-foreground w-4 text-center">
			{rank}
		</span>
	);
}

export default async function GroupPage({ params }: Props) {
	const { groupId } = await params;
	const data = await getGroupWithMembers(groupId);

	if (!data) notFound();

	const { group, leaderboard, currentUserId, currentUserRole } = data;
	const isOwner = currentUserRole === "owner";
	const ended = isPast(new Date(group.endDate));

	const inviteUrl = `${env.BETTER_AUTH_URL}/app/groups/join/${group.inviteCode}`;

	return (
		<div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
			{/* Back link */}
			<Link
				href="/app/groups"
				className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
			>
				<ChevronLeft className="size-4" />
				Grupos
			</Link>
			{/* Header */}
			<div className="flex flex-col gap-3">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-1.5 min-w-0">
						<div className="flex items-center gap-2 flex-wrap">
							{ended && <Trophy className="size-5 text-yellow-400 shrink-0" />}
							<h1 className="text-2xl font-bold truncate">{group.name}</h1>
						</div>
						<div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
							<span className="flex items-center gap-1.5">
								<Users className="size-3.5" />
								{leaderboard.length}{" "}
								{leaderboard.length === 1 ? "membro" : "membros"}
							</span>
							<span className="flex items-center gap-1.5">
								<CalendarDays className="size-3.5" />
								{ended
									? `Encerrado em ${format(new Date(group.endDate), "d 'de' MMM, yyyy", { locale: ptBR })}`
									: `Termina em ${format(new Date(group.endDate), "d 'de' MMM, yyyy", { locale: ptBR })}`}
							</span>
							{!ended && (
								<Badge
									variant="outline"
									className="text-vibrant-green border-vibrant-green/30 text-xs"
								>
									{formatDistanceToNow(new Date(group.endDate), { locale: ptBR })} restante
								</Badge>
							)}
							{ended && (
								<Badge
									variant="outline"
									className="text-yellow-400 border-yellow-400/30 text-xs"
								>
									Encerrado
								</Badge>
							)}
						</div>
					</div>

					<div className="flex items-center gap-2 shrink-0">
						{isOwner && (
							<GroupSettingsDialog
								groupId={group.id}
								currentName={group.name}
								currentEndDate={group.endDate}
								isActive={!ended}
							/>
						)}
						{!isOwner && !ended && <LeaveGroupButton groupId={group.id} />}
					</div>
				</div>

				{!ended && (
					<div className="flex flex-col gap-1.5">
						<p className="text-xs text-muted-foreground font-medium">
							Link de convite
						</p>
						<CopyInviteButton inviteUrl={inviteUrl} />
					</div>
				)}
			</div>

			<Separator />

			{/* Leaderboard */}
			<div className="flex flex-col gap-3">
				<h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
					Ranking
				</h2>

				{leaderboard.length === 0 ? (
					<p className="text-sm text-muted-foreground">Nenhum membro ainda.</p>
				) : (
					<div className="flex flex-col gap-1">
						{leaderboard.map((member, index) => {
							const rank = index + 1;
							const isCurrentUser = member.userId === currentUserId;

							return (
								<Link
									key={member.userId}
									href={`/app/groups/${group.id}/members/${member.userId}`}
									className={cn(
										"flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/5",
										isCurrentUser &&
										"bg-vibrant-green/5 border border-vibrant-green/20",
									)}
								>
									<div className="flex items-center justify-center w-5 shrink-0">
										<RankIcon rank={rank} />
									</div>

									<Avatar className="size-8 shrink-0">
										{member.user.avatarUrl && (
											<AvatarImage
												src={member.user.avatarUrl}
												alt={member.user.name}
											/>
										)}
										<AvatarFallback className="text-xs bg-neutral-800">
											{getInitials(member.user.name)}
										</AvatarFallback>
									</Avatar>

									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<span
												className={cn(
													"font-medium text-sm truncate",
													isCurrentUser && "text-vibrant-green",
												)}
											>
												{member.user.name}
											</span>
											{isCurrentUser && (
												<span className="text-[10px] text-muted-foreground shrink-0">
													você
												</span>
											)}
											{member.role === "owner" && (
												<span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground border border-border rounded px-1 py-0.5 shrink-0">
													Dono
												</span>
											)}
										</div>
										{member.user.username && (
											<p className="text-xs text-muted-foreground">
												@{member.user.username}
											</p>
										)}
									</div>

									<div className="text-right shrink-0">
										<p className="text-sm font-semibold">
											{member.workoutCount}
										</p>
										<p className="text-xs text-muted-foreground">treinos</p>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>

			<div className="text-xs text-muted-foreground text-center pb-4">
				Treinos registrados entre {format(new Date(group.startDate), "d 'de' MMM", { locale: ptBR })} –{" "}
				{format(new Date(group.endDate), "d 'de' MMM, yyyy", { locale: ptBR })}
			</div>
		</div>
	);
}
