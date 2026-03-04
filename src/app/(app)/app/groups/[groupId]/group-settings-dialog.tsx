"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
	updateGroupName,
	updateGroupEndDate,
	regenerateInviteCode,
	deleteGroup,
} from "@/actions/group-actions";
import { toast } from "sonner";
import { Settings, CalendarIcon, RefreshCw, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Props {
	groupId: string;
	currentName: string;
	currentEndDate: Date;
	isActive: boolean;
}

export function GroupSettingsDialog({ groupId, currentName, currentEndDate, isActive }: Props) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(currentName);
	const [endDate, setEndDate] = useState<Date>(new Date(currentEndDate));

	function handleOpenChange(value: boolean) {
		if (value) {
			setName(currentName);
			setEndDate(new Date(currentEndDate));
		}
		setOpen(value);
	}
	const [calendarOpen, setCalendarOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	function handleSaveName() {
		if (name.trim() === currentName) return;
		startTransition(async () => {
			try {
				await updateGroupName(groupId, name);
				toast.success("Group name updated");
			} catch {
				toast.error("Failed to update name");
			}
		});
	}

	function handleSaveEndDate() {
		startTransition(async () => {
			try {
				await updateGroupEndDate(groupId, endDate);
				toast.success("End date updated — members have been notified");
			} catch {
				toast.error("Failed to update end date");
			}
		});
	}

	function handleRegenerateCode() {
		startTransition(async () => {
			try {
				await regenerateInviteCode(groupId);
				toast.success("Invite link regenerated — old link is now invalid");
			} catch {
				toast.error("Failed to regenerate invite link");
			}
		});
	}

	function handleDelete() {
		startTransition(async () => {
			try {
				await deleteGroup(groupId);
				toast.success("Group deleted");
				setOpen(false);
				router.push("/app/groups");
			} catch {
				toast.error("Failed to delete group");
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<Settings className="size-4" />
					Settings
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Group Settings</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-5 pt-2">
					<div className="flex flex-col gap-2">
						<Label htmlFor="group-name-edit">Group name</Label>
						<div className="flex gap-2">
							<Input
								id="group-name-edit"
								value={name}
								onChange={(e) => setName(e.target.value)}
								maxLength={60}
							/>
							<Button
								size="sm"
								onClick={handleSaveName}
								disabled={isPending || name.trim() === currentName}
							>
								Save
							</Button>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label>End date</Label>
						<div className="flex gap-2">
							<Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn("flex-1 justify-start gap-2 font-normal")}
									>
										<CalendarIcon className="size-4" />
										{format(endDate, "PPP")}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={endDate}
										onSelect={(d) => {
											if (d) {
												setEndDate(d);
												setCalendarOpen(false);
											}
										}}
										disabled={(d) => d <= new Date()}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<Button
								size="sm"
								onClick={handleSaveEndDate}
								disabled={
									isPending ||
									endDate.toDateString() === new Date(currentEndDate).toDateString()
								}
							>
								Save
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							All members will be notified when you change this.
						</p>
					</div>

					{isActive && (
						<>
							<Separator />
							<div className="flex flex-col gap-2">
								<Label>Invite link</Label>
								<Button
									variant="outline"
									size="sm"
									className="gap-2 self-start"
									onClick={handleRegenerateCode}
									disabled={isPending}
								>
									<RefreshCw className="size-4" />
									Regenerate invite link
								</Button>
								<p className="text-xs text-muted-foreground">
									The old link will stop working immediately.
								</p>
							</div>
						</>
					)}

					<Separator />

					<div className="flex flex-col gap-2">
						<Label className="text-destructive">Danger zone</Label>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive" size="sm" className="gap-2 self-start">
									<Trash2 className="size-4" />
									Delete group
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Delete "{currentName}"?</AlertDialogTitle>
									<AlertDialogDescription>
										This will permanently delete the group and remove all members. This
										cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleDelete}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
