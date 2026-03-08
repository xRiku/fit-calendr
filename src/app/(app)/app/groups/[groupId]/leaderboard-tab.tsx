import { Trophy, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import Link from "next/link";

interface LeaderboardMember {
	userId: string;
	role: string;
	workoutCount: number;
	user: {
		id: string;
		name: string;
		username: string | null;
		avatarUrl: string | null;
	};
}

interface LeaderboardTabProps {
	groupId: string;
	leaderboard: LeaderboardMember[];
	currentUserId: string;
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

export function LeaderboardTab({
	groupId,
	leaderboard,
	currentUserId,
}: LeaderboardTabProps) {
	if (leaderboard.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">Nenhum membro ainda.</p>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			{leaderboard.map((member, index) => {
				const rank = index + 1;
				const isCurrentUser = member.userId === currentUserId;

				return (
					<Link
						key={member.userId}
						href={`/app/groups/${groupId}/members/${member.user.username ?? member.userId}`}
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
							<p className="text-sm font-semibold">{member.workoutCount}</p>
							<p className="text-xs text-muted-foreground">treinos</p>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
