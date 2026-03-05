"use client";

import Link from "next/link";
import { formatDistanceToNow, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trophy, Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type GroupWithCount = {
	id: string;
	name: string;
	endDate: Date;
	role: string;
	_count: { members: number };
};

export function GroupCard({ group }: { group: GroupWithCount }) {
	const ended = isPast(new Date(group.endDate));

	return (
		<Link
			href={`/app/groups/${group.id}`}
			className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:bg-card/80"
		>
			<div className="flex flex-col gap-1 min-w-0">
				<div className="flex items-center gap-2">
					{ended && <Trophy className="size-4 shrink-0 text-yellow-400" />}
					<span className="font-semibold truncate">{group.name}</span>
					{group.role === "owner" && (
						<span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground border border-border rounded px-1.5 py-0.5">
							Dono
						</span>
					)}
				</div>
				<div className="flex items-center gap-3 text-xs text-muted-foreground">
					<span className="flex items-center gap-1">
						<Users className="size-3" />
						{group._count.members}{" "}
						{group._count.members === 1 ? "membro" : "membros"}
					</span>
					<span
						className={cn(
							ended ? "text-muted-foreground" : "text-vibrant-green",
						)}
					>
						{ended
							? `Encerrado ${formatDistanceToNow(new Date(group.endDate), { addSuffix: true, locale: ptBR })}`
							: `Termina ${formatDistanceToNow(new Date(group.endDate), { addSuffix: true, locale: ptBR })}`}
					</span>
				</div>
			</div>
			<ChevronRight className="size-4 shrink-0 text-muted-foreground" />
		</Link>
	);
}
