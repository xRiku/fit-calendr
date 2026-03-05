"use client";

import { useTransition } from "react";
import { useWebHaptics } from "web-haptics/react";
import { useRouter } from "next/navigation";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { leaveGroup } from "@/actions/group-actions";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export function LeaveGroupButton({ groupId }: { groupId: string }) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const haptic = useWebHaptics();

	function handleLeave() {
		startTransition(async () => {
			try {
				haptic.trigger("warning");
				await leaveGroup(groupId);
				toast.success("Você saiu do grupo");
				router.push("/app/groups");
			} catch (err) {
				haptic.trigger("error");
				toast.error(
					err instanceof Error ? err.message : "Falha ao sair do grupo",
				);
			}
		});
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="gap-2"
					disabled={isPending}
				>
					<LogOut className="size-4" />
					Sair do grupo
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Leave this group?</AlertDialogTitle>
					<AlertDialogDescription>
						You'll need a new invite link to rejoin.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleLeave}>Leave</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
