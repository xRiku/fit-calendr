"use client";

import { addDayInfo, updateDayInfo } from "@/actions/actions";
import { getUserPresets } from "@/actions/preset-actions";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { WorkoutChip } from "@/components/workout-chip-input";
import { WorkoutChipInput } from "@/components/workout-chip-input";
import { useModalStore } from "@/stores/day-info-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
	cheatMealName: z.string().max(50).optional(),
});

export default function DayInfoForm() {
	const { selectedDayInfo, dayInfoType, toggleDayInfoModalState } =
		useModalStore();
	const [workoutChips, setWorkoutChips] = useState<WorkoutChip[]>([]);
	const [presets, setPresets] = useState<
		Awaited<ReturnType<typeof getUserPresets>>
	>([]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			cheatMealName: selectedDayInfo?.cheatMeal?.name ?? "",
		},
	});

	useEffect(() => {
		const loadPresets = async () => {
			const userPresets = await getUserPresets();
			setPresets(userPresets);
		};
		loadPresets();
	}, []);

	useEffect(() => {
		if (dayInfoType === "edit" && selectedDayInfo?.gymCheck) {
			const chip: WorkoutChip = {
				id: crypto.randomUUID(),
				label: selectedDayInfo.gymCheck.description,
				color: "#3b82f6",
			};
			setWorkoutChips([chip]);
		} else {
			setWorkoutChips([]);
		}
	}, [dayInfoType, selectedDayInfo]);

	return (
		<Form {...form}>
			<form
				id="day-info-form"
				action={async () => {
					const formData = new FormData();
					formData.set("cheatMealName", form.getValues().cheatMealName || "");
					formData.set("workouts", JSON.stringify(workoutChips));

					if (dayInfoType === "create") {
						toast.promise(
							addDayInfo({
								formData,
								date: selectedDayInfo?.date ?? new Date(),
							}),
							{
								loading: "Adding day info...",
								success: "Day info added",
								error: "Error",
							},
						);
					}

					if (dayInfoType === "edit") {
						toast.promise(
							updateDayInfo({
								cheatMealId: selectedDayInfo?.cheatMeal?.id,
								gymCheckId: selectedDayInfo?.gymCheck?.id,
								cheatMealName: form.formState.dirtyFields?.cheatMealName
									? form.getValues().cheatMealName
									: undefined,
								workoutDescription:
									workoutChips.length > 0
										? workoutChips[0]?.label
										: workoutChips.length === 0 && selectedDayInfo?.gymCheck
											? ""
											: undefined,
								date: selectedDayInfo?.date ?? new Date(),
							}),
							{
								loading: "Editing day info...",
								success: "Day info updated",
								error: "Error",
							},
						);
					}

					toggleDayInfoModalState();
				}}
				className="space-y-4 flex flex-col items-end justify-center"
			>
				<FormItem className="w-full">
					<FormLabel className="font-bold">
						Workouts <span className="text-xs font-normal">(Optional)</span>
					</FormLabel>
					<FormControl>
						<WorkoutChipInput
							presets={presets}
							value={workoutChips}
							onChange={setWorkoutChips}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
				<FormField
					control={form.control}
					name="cheatMealName"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel className="font-bold">
								Cheat meal name{" "}
								<span className="text-xs font-normal">(Optional)</span>
							</FormLabel>
							<FormControl>
								<Input placeholder="e.g Hamburger" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
			<div className="flex flex-col w-full sm:hidden gap-2 mt-4 pb-4">
				<Button
					type="submit"
					disabled={
						!workoutChips.length &&
						!form.getValues().cheatMealName &&
						dayInfoType === "create"
					}
					form="day-info-form"
				>
					Save
				</Button>
				<Button variant="outline" onClick={() => toggleDayInfoModalState()}>
					Cancel
				</Button>
			</div>
			<div className="hidden sm:flex sm:justify-center gap-4">
				<Button
					variant="outline"
					className="w-1/4"
					onClick={() => toggleDayInfoModalState()}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={
						!workoutChips.length &&
						!form.getValues().cheatMealName &&
						dayInfoType === "create"
					}
					className="w-1/4"
					form="day-info-form"
				>
					Save
				</Button>
			</div>
		</Form>
	);
}
