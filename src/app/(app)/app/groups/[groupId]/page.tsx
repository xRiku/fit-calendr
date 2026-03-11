import {
  getGroupWithMembers,
  getGroupStreak,
  getGroupWeeklyLeaderboard,
  getGroupStreakLeaderboard,
  getGroupActivityFeed,
  getGroupCalendarData,
} from "@/lib/server-utils";

function formatTimeRemaining(endDate: Date): string {
  const dist = formatDistanceToNow(endDate, { locale: ptBR });
  const plural = !dist.match(/^(menos de |1 |um |uma )/i);
  return `${dist} ${plural ? "restantes" : "restante"}`;
}
import { notFound } from "next/navigation";
import { isPast, formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trophy, Users, CalendarDays, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GroupSettingsDialog } from "./group-settings-dialog";
import { LeaveGroupButton } from "./leave-group-button";
import { CopyInviteButton } from "./copy-invite-button";
import { GroupStreakBanner } from "./group-streak-banner";
import { GroupTabs, TabsContent } from "./group-tabs";
import { LeaderboardTab } from "./leaderboard-tab";
import { ActivityFeedTab } from "./activity-feed-tab";
import { GroupCalendarTab } from "./group-calendar-tab";
import { env } from "@/env";
import Link from "next/link";

interface Props {
  params: Promise<{ groupId: string }>;
}

export default async function GroupPage({ params }: Props) {
  const { groupId } = await params;
  const [
    data,
    groupStreak,
    weeklyData,
    streakLeaderboard,
    activityFeed,
    calendarResult,
  ] = await Promise.all([
    getGroupWithMembers(groupId),
    getGroupStreak(groupId),
    getGroupWeeklyLeaderboard(groupId),
    getGroupStreakLeaderboard(groupId),
    getGroupActivityFeed(groupId),
    getGroupCalendarData(groupId),
  ]);

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
            {group.description && (
              <p className="text-sm text-muted-foreground">{group.description}</p>
            )}
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
                  {formatTimeRemaining(new Date(group.endDate))}
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
                currentDescription={group.description}
                currentEndDate={group.endDate}
                isActive={!ended}
                allowRetroactiveWorkouts={group.allowRetroactiveWorkouts}
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

      <GroupStreakBanner
        currentGroupStreak={groupStreak.currentGroupStreak}
        longestGroupStreak={groupStreak.longestGroupStreak}
      />

      <Separator />

      {/* Tabbed content */}
      <GroupTabs>
        <TabsContent value="ranking">
          <div className="flex flex-col gap-3">
            <LeaderboardTab
              groupId={group.id}
              leaderboard={leaderboard}
              weeklyLeaderboard={weeklyData.weeklyLeaderboard}
              streakLeaderboard={streakLeaderboard}
              lastWeekMvp={weeklyData.lastWeekMvp}
              weekStart={weeklyData.weekStart}
              currentUserId={currentUserId}
            />

            <div className="text-xs text-muted-foreground text-center pb-4">
              Treinos registrados entre{" "}
              {format(new Date(group.startDate), "d 'de' MMM", {
                locale: ptBR,
              })}{" "}
              –{" "}
              {format(new Date(group.endDate), "d 'de' MMM, yyyy", {
                locale: ptBR,
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="feed">
          <ActivityFeedTab feed={activityFeed} />
        </TabsContent>

        <TabsContent value="calendar">
          <GroupCalendarTab
            calendarData={calendarResult.calendarData}
            startDate={calendarResult.startDate}
            endDate={calendarResult.endDate}
          />
        </TabsContent>
      </GroupTabs>
    </div>
  );
}
