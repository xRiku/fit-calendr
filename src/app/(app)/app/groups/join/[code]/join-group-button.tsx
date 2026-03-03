"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { joinGroupByCode } from "@/actions/group-actions";
import { toast } from "sonner";

export function JoinGroupButton({
	inviteCode,
	groupId,
}: {
	inviteCode: string;
	groupId: string;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	function handleJoin() {
		startTransition(async () => {
			try {
				const result = await joinGroupByCode(inviteCode);
				if (result.alreadyMember) {
					router.push(`/app/groups/${groupId}`);
					return;
				}
				toast.success("You joined the group!");
				router.push(`/app/groups/${groupId}`);
			} catch (err) {
				const message = err instanceof Error ? err.message : "Failed to join group";
				if (message === "Unauthorized") {
					router.push(`/auth/sign-in?redirect=/app/groups/join/${inviteCode}`);
				} else {
					toast.error(message);
				}
			}
		});
	}

	return (
		<Button className="w-full" onClick={handleJoin} disabled={isPending}>
			{isPending ? "Joining…" : "Join Group"}
		</Button>
	);
}
