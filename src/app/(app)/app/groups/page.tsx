import { getUserGroups } from "@/lib/server-utils";
import H1 from "@/components/h1";
import { CreateGroupDialog } from "./create-group-dialog";
import { GroupCard } from "./group-card";

export default async function GroupsPage() {
	const groups = await getUserGroups();

	const now = new Date();
	const active = groups.filter((g) => new Date(g.endDate) > now);
	const ended = groups.filter((g) => new Date(g.endDate) <= now);

	return (
		<div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
			<div className="flex items-center justify-between">
				<H1>Groups</H1>
				<CreateGroupDialog />
			</div>

			{groups.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
					<p className="text-muted-foreground text-sm">No groups yet.</p>
					<p className="text-muted-foreground text-xs">
						Create a challenge group and invite your friends.
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-6">
					{active.length > 0 && (
						<section className="flex flex-col gap-3">
							<h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
								Active
							</h2>
							{active.map((group) => (
								<GroupCard key={group.id} group={group} />
							))}
						</section>
					)}

					{ended.length > 0 && (
						<section className="flex flex-col gap-3">
							<h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
								Ended
							</h2>
							{ended.map((group) => (
								<GroupCard key={group.id} group={group} />
							))}
						</section>
					)}
				</div>
			)}
		</div>
	);
}
