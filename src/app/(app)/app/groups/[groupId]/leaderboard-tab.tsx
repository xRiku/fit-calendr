"use client";

import { useState } from "react";
import { Trophy, Medal, Flame } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { cn, getInitials } from "@/lib/utils";
import Link from "next/link";

interface MemberUser {
	id: string;
	name: string;
	username: string | null;
	avatarUrl: string | null;
}

interface TotalMember {
	userId: string;
	role: string;
	workoutCount: number;
	user: MemberUser;
}

interface WeeklyMember {
	userId: string;
	role: string;
	workoutCount: number;
	user: MemberUser;
}

interface StreakMember {
	userId: string;
	role: string;
	currentStreak: number;
	longestStreak: number;
	user: MemberUser;
}

interface LastWeekMvp {
	user: MemberUser;
	workoutCount: number;
}

interface LeaderboardTabProps {
	groupId: string;
	leaderboard: TotalMember[];
	weeklyLeaderboard: WeeklyMember[];
	streakLeaderboard: StreakMember[];
	lastWeekMvp: LastWeekMvp | null;
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

function MemberRow({
	groupId,
	member,
	rank,
	isCurrentUser,
	rightContent,
}: {
	groupId: string;
	member: { userId: string; role: string; user: MemberUser };
	rank: number;
	isCurrentUser: boolean;
	rightContent: React.ReactNode;
}) {
	return (
		<Link
			href={`/app/groups/${groupId}/members/${member.user.username ?? member.userId}`}
			className={cn(
				"flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/5",
				isCurrentUser && "bg-vibrant-green/5 border border-vibrant-green/20",
			)}
		>
			<div className="flex items-center justify-center w-5 shrink-0">
				<RankIcon rank={rank} />
			</div>

			<Avatar className="size-8 shrink-0">
				{member.user.avatarUrl && (
					<AvatarImage src={member.user.avatarUrl} alt={member.user.name} />
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

			{rightContent}
		</Link>
	);
}

export function LeaderboardTab({
	groupId,
	leaderboard,
	weeklyLeaderboard,
	streakLeaderboard,
	lastWeekMvp,
	currentUserId,
}: LeaderboardTabProps) {
	const [view, setView] = useState("total");

	return (
		<div className="flex flex-col gap-3">
			<ToggleGroup
				type="single"
				value={view}
				onValueChange={(v) => {
					if (v) setView(v);
				}}
				variant="outline"
				size="sm"
				className="w-full"
			>
				<ToggleGroupItem value="total" className="flex-1 text-xs">
					Total
				</ToggleGroupItem>
				<ToggleGroupItem value="weekly" className="flex-1 text-xs">
					Semana
				</ToggleGroupItem>
				<ToggleGroupItem value="streaks" className="flex-1 text-xs">
					Streaks
				</ToggleGroupItem>
			</ToggleGroup>

			{view === "total" && (
				<TotalView
					groupId={groupId}
					leaderboard={leaderboard}
					currentUserId={currentUserId}
				/>
			)}

			{view === "weekly" && (
				<WeeklyView
					groupId={groupId}
					weeklyLeaderboard={weeklyLeaderboard}
					lastWeekMvp={lastWeekMvp}
					currentUserId={currentUserId}
				/>
			)}

			{view === "streaks" && (
				<StreakView
					groupId={groupId}
					streakLeaderboard={streakLeaderboard}
					currentUserId={currentUserId}
				/>
			)}
		</div>
	);
}

function TotalView({
	groupId,
	leaderboard,
	currentUserId,
}: {
	groupId: string;
	leaderboard: TotalMember[];
	currentUserId: string;
}) {
	if (leaderboard.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">Nenhum membro ainda.</p>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			{leaderboard.map((member, index) => (
				<MemberRow
					key={member.userId}
					groupId={groupId}
					member={member}
					rank={index + 1}
					isCurrentUser={member.userId === currentUserId}
					rightContent={
						<div className="text-right shrink-0">
							<p className="text-sm font-semibold">{member.workoutCount}</p>
							<p className="text-xs text-muted-foreground">treinos</p>
						</div>
					}
				/>
			))}
		</div>
	);
}

function WeeklyView({
	groupId,
	weeklyLeaderboard,
	lastWeekMvp,
	currentUserId,
}: {
	groupId: string;
	weeklyLeaderboard: WeeklyMember[];
	lastWeekMvp: LastWeekMvp | null;
	currentUserId: string;
}) {
	return (
		<div className="flex flex-col gap-3">
			{lastWeekMvp && (
				<div className="flex items-center gap-3 rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-3">
					<Trophy className="size-4 text-yellow-400 shrink-0" />
					<div className="flex items-center gap-2 min-w-0">
						<Avatar className="size-6 shrink-0">
							{lastWeekMvp.user.avatarUrl && (
								<AvatarImage
									src={lastWeekMvp.user.avatarUrl}
									alt={lastWeekMvp.user.name}
								/>
							)}
							<AvatarFallback className="text-[10px] bg-neutral-800">
								{getInitials(lastWeekMvp.user.name)}
							</AvatarFallback>
						</Avatar>
						<p className="text-xs text-muted-foreground truncate">
							<span className="font-medium text-foreground">
								{lastWeekMvp.user.name}
							</span>{" "}
							foi MVP da semana passada com{" "}
							<span className="font-medium text-foreground">
								{lastWeekMvp.workoutCount}
							</span>{" "}
							treinos
						</p>
					</div>
				</div>
			)}

			{weeklyLeaderboard.length === 0 ? (
				<p className="text-sm text-muted-foreground">Nenhum membro ainda.</p>
			) : (
				<div className="flex flex-col gap-1">
					{weeklyLeaderboard.map((member, index) => (
						<MemberRow
							key={member.userId}
							groupId={groupId}
							member={member}
							rank={index + 1}
							isCurrentUser={member.userId === currentUserId}
							rightContent={
								<div className="text-right shrink-0">
									<p className="text-sm font-semibold">
										{member.workoutCount}
									</p>
									<p className="text-xs text-muted-foreground">esta semana</p>
								</div>
							}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function StreakView({
	groupId,
	streakLeaderboard,
	currentUserId,
}: {
	groupId: string;
	streakLeaderboard: StreakMember[];
	currentUserId: string;
}) {
	if (streakLeaderboard.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">Nenhum membro ainda.</p>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			{streakLeaderboard.map((member, index) => (
				<MemberRow
					key={member.userId}
					groupId={groupId}
					member={member}
					rank={index + 1}
					isCurrentUser={member.userId === currentUserId}
					rightContent={
						<div className="text-right shrink-0">
							<div className="flex items-center gap-1 justify-end">
								{member.currentStreak > 0 && (
									<Flame className="size-3.5 text-vibrant-green" />
								)}
								<p className="text-sm font-semibold">
									{member.currentStreak}d
								</p>
							</div>
							{member.longestStreak > member.currentStreak && (
								<p className="text-xs text-muted-foreground">
									melhor: {member.longestStreak}d
								</p>
							)}
						</div>
					}
				/>
			))}
		</div>
	);
}
