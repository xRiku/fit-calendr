import { Dumbbell, PartyPopper } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type WorkoutItem = {
	kind: "workout";
	id: string;
	createdAt: Date;
	user: {
		id: string;
		name: string;
		username: string | null;
		avatarUrl: string | null;
	};
	description: string;
	presetLabel: string | null;
	presetColor: string | null;
};

type MilestoneItem = {
	kind: "milestone";
	id: string;
	createdAt: Date;
	message: string;
	type: string;
};

export type FeedItem = WorkoutItem | MilestoneItem;

interface ActivityFeedTabProps {
	feed: FeedItem[];
}

export function ActivityFeedTab({ feed }: ActivityFeedTabProps) {
	if (feed.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
				<Dumbbell className="size-8" />
				<p className="text-sm">Nenhuma atividade ainda</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			{feed.map((item) =>
				item.kind === "workout" ? (
					<WorkoutFeedItem key={item.id} item={item} />
				) : (
					<MilestoneFeedItem key={item.id} item={item} />
				),
			)}
		</div>
	);
}

function WorkoutFeedItem({ item }: { item: WorkoutItem }) {
	const label = item.presetLabel ?? item.description;

	return (
		<div className="flex items-center gap-3 rounded-xl px-4 py-3">
			<Avatar className="size-8 shrink-0">
				{item.user.avatarUrl && (
					<AvatarImage src={item.user.avatarUrl} alt={item.user.name} />
				)}
				<AvatarFallback className="text-xs bg-neutral-800">
					{getInitials(item.user.name)}
				</AvatarFallback>
			</Avatar>

			<div className="flex-1 min-w-0">
				<p className="text-sm">
					<span className="font-medium">{item.user.name}</span>{" "}
					<span className="text-muted-foreground">registrou</span>{" "}
					<span className="font-medium inline-flex items-center gap-1">
						{item.presetColor && (
							<span
								className="inline-block size-2 rounded-full shrink-0"
								style={{ backgroundColor: item.presetColor }}
							/>
						)}
						{label}
					</span>
				</p>
			</div>

			<span className="text-xs text-muted-foreground shrink-0">
				{formatDistanceToNow(new Date(item.createdAt), {
					addSuffix: false,
					locale: ptBR,
				})}
			</span>
		</div>
	);
}

function MilestoneFeedItem({ item }: { item: MilestoneItem }) {
	return (
		<div className="flex items-center gap-3 rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-3">
			<div className="flex items-center justify-center size-8 shrink-0">
				<PartyPopper className="size-4 text-yellow-400" />
			</div>

			<p className="text-sm flex-1 min-w-0">{item.message}</p>

			<span className="text-xs text-muted-foreground shrink-0">
				{formatDistanceToNow(new Date(item.createdAt), {
					addSuffix: false,
					locale: ptBR,
				})}
			</span>
		</div>
	);
}
