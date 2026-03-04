"use client";

import { useReducer, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createGroup, type GroupDuration } from "@/actions/group-actions";
import { toast } from "sonner";
import { Plus, CalendarIcon } from "lucide-react";
import { format, addDays, addMonths, addYears, endOfYear } from "date-fns";
import { cn } from "@/lib/utils";

const DURATION_OPTIONS: { value: GroupDuration; label: string; description: string }[] = [
	{ value: "30d", label: "30 Days", description: "1-month challenge" },
	{ value: "90d", label: "90 Days", description: "Classic 3-month challenge" },
	{ value: "6m", label: "6 Months", description: "Half-year challenge" },
	{ value: "eoy", label: "End of Year", description: `Until Dec 31, ${new Date().getFullYear()}` },
	{ value: "1y", label: "1 Year", description: "Full year challenge" },
	{ value: "custom", label: "Custom", description: "Pick your own end date" },
];

function getPreviewEndDate(duration: GroupDuration, customDate?: Date): Date | null {
	const now = new Date();
	switch (duration) {
		case "30d": return addDays(now, 30);
		case "90d": return addDays(now, 90);
		case "6m": return addMonths(now, 6);
		case "eoy": return endOfYear(now);
		case "1y": return addYears(now, 1);
		case "custom": return customDate ?? null;
	}
}

type DialogState = {
	open: boolean;
	name: string;
	duration: GroupDuration;
	customDate: Date | undefined;
	calendarOpen: boolean;
};

type DialogAction =
	| { type: "SET_OPEN"; open: boolean }
	| { type: "SET_NAME"; name: string }
	| { type: "SET_DURATION"; duration: GroupDuration }
	| { type: "SET_CUSTOM_DATE"; date: Date | undefined }
	| { type: "SET_CALENDAR_OPEN"; open: boolean }
	| { type: "RESET" };

const initialState: DialogState = {
	open: false,
	name: "",
	duration: "90d",
	customDate: undefined,
	calendarOpen: false,
};

function reducer(state: DialogState, action: DialogAction): DialogState {
	switch (action.type) {
		case "SET_OPEN": return { ...state, open: action.open };
		case "SET_NAME": return { ...state, name: action.name };
		case "SET_DURATION": return { ...state, duration: action.duration };
		case "SET_CUSTOM_DATE": return { ...state, customDate: action.date };
		case "SET_CALENDAR_OPEN": return { ...state, calendarOpen: action.open };
		case "RESET": return initialState;
	}
}

export function CreateGroupDialog() {
	const router = useRouter();
	const [state, dispatch] = useReducer(reducer, initialState);
	const { open, name, duration, customDate, calendarOpen } = state;
	const [isPending, startTransition] = useTransition();

	const previewEnd = getPreviewEndDate(duration, customDate);
	const canSubmit = name.trim().length >= 2 && (duration !== "custom" || !!customDate);

	function handleSubmit() {
		startTransition(async () => {
			try {
				const group = await createGroup({ name, duration, customEndDate: customDate });
				toast.success(`"${group.name}" created!`);
				dispatch({ type: "RESET" });
				router.push(`/app/groups/${group.id}`);
			} catch {
				toast.error("Failed to create group");
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={(o) => dispatch({ type: "SET_OPEN", open: o })}>
			<DialogTrigger asChild>
				<Button size="sm" className="gap-2">
					<Plus className="size-4" />
					New Group
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create a Challenge Group</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-5 pt-2">
					<div className="flex flex-col gap-2">
						<Label htmlFor="group-name">Group name</Label>
						<Input
							id="group-name"
							placeholder="e.g. 90 Day Summer Challenge"
							value={name}
							onChange={(e) => dispatch({ type: "SET_NAME", name: e.target.value })}
							maxLength={60}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Duration</Label>
						<div className="grid grid-cols-2 gap-2">
							{DURATION_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => dispatch({ type: "SET_DURATION", duration: opt.value })}
									className={cn(
										"flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
										duration === opt.value
											? "border-vibrant-green bg-vibrant-green/10 text-white"
											: "border-border text-muted-foreground hover:border-white/20 hover:text-white",
									)}
								>
									<span className="font-medium">{opt.label}</span>
									<span className="text-xs opacity-70">{opt.description}</span>
								</button>
							))}
						</div>
					</div>

					{duration === "custom" && (
						<div className="flex flex-col gap-2">
							<Label>End date</Label>
							<Popover
								open={calendarOpen}
								onOpenChange={(o) => dispatch({ type: "SET_CALENDAR_OPEN", open: o })}
							>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"justify-start gap-2 font-normal",
											!customDate && "text-muted-foreground",
										)}
									>
										<CalendarIcon className="size-4" />
										{customDate ? format(customDate, "PPP") : "Pick a date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={customDate}
										onSelect={(d) => {
											dispatch({ type: "SET_CUSTOM_DATE", date: d });
											dispatch({ type: "SET_CALENDAR_OPEN", open: false });
										}}
										disabled={(d) => d <= new Date()}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
					)}

					{previewEnd && (
						<p className="text-sm text-muted-foreground">
							Challenge ends{" "}
							<span className="text-white font-medium">{format(previewEnd, "MMMM d, yyyy")}</span>
						</p>
					)}

					<Button onClick={handleSubmit} disabled={!canSubmit || isPending}>
						{isPending ? "Creating…" : "Create Group"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
