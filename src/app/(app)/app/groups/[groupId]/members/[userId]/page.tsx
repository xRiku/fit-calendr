import { getMemberProfile } from "@/lib/server-utils";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { HeatmapGrid } from "@/components/dashboard/yearly-heatmap/heatmap-grid";
import { ChevronLeft, Flame, Trophy, Dumbbell, CalendarDays } from "lucide-react";
import Link from "next/link";

interface Props {
	params: Promise<{ groupId: string; userId: string }>;
}

function getInitials(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function StatCard({
	icon: Icon,
	label,
	value,
	accent,
}: {
	icon: React.ElementType;
	label: string;
	value: number | string;
	accent?: boolean;
}) {
	return (
		<div className="flex flex-col gap-1 rounded-xl border border-border bg-card px-4 py-3">
			<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
				<Icon className={`size-3.5 ${accent ? "text-vibrant-green" : ""}`} />
				{label}
			</div>
			<p className={`text-2xl font-bold ${accent ? "text-vibrant-green" : ""}`}>{value}</p>
		</div>
	);
}

export default async function MemberProfilePage({ params }: Props) {
	const { groupId, userId } = await params;
	const data = await getMemberProfile(groupId, userId);

	if (!data) notFound();

	const { user, group, joinedAt, role, stats, heatmapData, year, isOwnProfile } = data;

	return (
		<div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
			{/* Back link */}
			<Link
				href={`/app/groups/${groupId}`}
				className="flex items-center gap-1 text-sm text-muted-foreground hover:text-white transition-colors self-start"
			>
				<ChevronLeft className="size-4" />
				{group.name}
			</Link>

			{/* Profile header */}
			<div className="flex items-center gap-4">
				<Avatar className="size-16">
					<AvatarFallback className="bg-neutral-800 text-lg">
						{getInitials(user.name)}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col gap-0.5">
					<div className="flex items-center gap-2">
						<h1 className="text-xl font-bold">{user.name}</h1>
						{isOwnProfile && (
							<span className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5">
								you
							</span>
						)}
						{role === "owner" && (
							<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5">
								Owner
							</span>
						)}
					</div>
					{user.username && (
						<p className="text-sm text-muted-foreground">@{user.username}</p>
					)}
					<p className="text-xs text-muted-foreground">
						Joined {format(new Date(joinedAt), "MMM d, yyyy")}
					</p>
				</div>
			</div>

			<Separator />

			{/* Stats */}
			<div className="flex flex-col gap-3">
				<h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
					Challenge stats
				</h2>
				<div className="grid grid-cols-2 gap-3">
					<StatCard
						icon={Dumbbell}
						label={`Workouts in ${group.name}`}
						value={stats.challengeWorkouts}
						accent
					/>
						<StatCard icon={CalendarDays} label="Total workouts" value={stats.totalWorkouts} />
					<StatCard icon={Flame} label="Current streak" value={`${stats.currentStreak}d`} accent={stats.currentStreak > 0} />
					<StatCard icon={Trophy} label="Longest streak" value={`${stats.longestStreak}d`} />
				</div>
			</div>

			<Separator />

			{/* Heatmap */}
			<div className="flex flex-col gap-3">
				<h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
					{year} activity
				</h2>
				<HeatmapGrid data={heatmapData} year={year} selected="workout" />
			</div>
		</div>
	);
}
