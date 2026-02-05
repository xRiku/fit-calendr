"use client";

import { addDayInfo, updateDayInfo } from "@/actions/actions";
import {
	getUserCheatMealPresets,
	getUserPresets,
} from "@/actions/preset-actions";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import type {
	CheatMealChip,
	CheatMealChipInputRef,
} from "@/components/cheat-meal-chip-input";
import { CheatMealChipInput } from "@/components/cheat-meal-chip-input";
import type {
	WorkoutChip,
	WorkoutChipInputRef,
} from "@/components/workout-chip-input";
import { WorkoutChipInput } from "@/components/workout-chip-input";
import { useModalStore } from "@/stores/day-info-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({});

export default function DayInfoForm() {
	const { selectedDayInfo, dayInfoType, toggleDayInfoModalState } =
		useModalStore();
	const [workoutChips, setWorkoutChips] = useState<WorkoutChip[]>([]);
	const [cheatMealChips, setCheatMealChips] = useState<CheatMealChip[]>([]);
	const [workoutPresets, setWorkoutPresets] = useState<
		Awaited<ReturnType<typeof getUserPresets>>
	>([]);
	const [cheatMealPresets, setCheatMealPresets] = useState<
		Awaited<ReturnType<typeof getUserCheatMealPresets>>
	>([]);
	const workoutInputRef = useRef<WorkoutChipInputRef>(null);
	const cheatMealInputRef = useRef<CheatMealChipInputRef>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	useEffect(() => {
		const loadPresets = async () => {
			const [userPresets, userCheatMealPresets] = await Promise.all([
				getUserPresets(),
				getUserCheatMealPresets(),
			]);
			setWorkoutPresets(userPresets);
			setCheatMealPresets(userCheatMealPresets);
		};
		loadPresets();
	}, []);

	useEffect(() => {
		if (dayInfoType === "edit" && selectedDayInfo) {
			if (selectedDayInfo.gymChecks) {
				const chips: WorkoutChip[] = selectedDayInfo.gymChecks.map(
					(gymCheck) => ({
						id: gymCheck.id,
						label: gymCheck.description,
						color: gymCheck.presetColor ?? "#3b82f6",
						presetId: gymCheck.presetId || undefined,
					}),
				);
				setWorkoutChips(chips);
			}
			if (selectedDayInfo.cheatMeals) {
				const chips: CheatMealChip[] = selectedDayInfo.cheatMeals.map(
					(meal) => ({
						id: meal.id,
						label: meal.name,
						color: meal.presetColor ?? "#f97316",
						presetId: meal.presetId || undefined,
					}),
				);
				setCheatMealChips(chips);
			}
		} else {
			setWorkoutChips([]);
			setCheatMealChips([]);
		}
	}, [dayInfoType, selectedDayInfo]);

	return (
		<Form {...form}>
			<form
				id="day-info-form"
				action={async () => {
					const [flushedWorkoutChip, flushedCheatMealChip] = await Promise.all([
						workoutInputRef.current?.flushInput() ?? null,
						cheatMealInputRef.current?.flushInput() ?? null,
					]);

					const formData = new FormData();

					const workoutsToSubmit = flushedWorkoutChip
						? [...workoutChips, flushedWorkoutChip]
						: workoutChips;
					formData.set("workouts", JSON.stringify(workoutsToSubmit));

					const cheatMealsToSubmit = flushedCheatMealChip
						? [...cheatMealChips, flushedCheatMealChip]
						: cheatMealChips;
					formData.set("cheatMeals", JSON.stringify(cheatMealsToSubmit));

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
						const existingWorkoutIds =
							selectedDayInfo?.gymChecks?.map((w) => w.id) || [];
						const existingCheatMealIds =
							selectedDayInfo?.cheatMeals?.map((m) => m.id) || [];

						toast.promise(
							updateDayInfo({
								workouts: workoutsToSubmit,
								existingWorkoutIds,
								cheatMeals: cheatMealsToSubmit,
								existingCheatMealIds,
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
				className="space-y-6 sm:space-y-4 flex flex-col items-end justify-center"
			>
				<FormItem className="w-full">
					<FormLabel className="font-bold">
						Workouts <span className="text-xs font-normal">(Optional)</span>
					</FormLabel>
					<FormControl>
						<WorkoutChipInput
							ref={workoutInputRef}
							presets={workoutPresets}
							value={workoutChips}
							onChange={setWorkoutChips}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
				<FormItem className="w-full">
					<FormLabel className="font-bold">
						Cheat meals <span className="text-xs font-normal">(Optional)</span>
					</FormLabel>
					<FormControl>
						<CheatMealChipInput
							ref={cheatMealInputRef}
							presets={cheatMealPresets}
							value={cheatMealChips}
							onChange={setCheatMealChips}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			</form>
			<div className="flex flex-col w-full sm:hidden gap-3 mt-6 pb-6">
				<Button
					type="submit"
					size="lg"
					className="h-12 text-base"
					disabled={
						!workoutChips.length &&
						!cheatMealChips.length &&
						dayInfoType === "create"
					}
					form="day-info-form"
				>
					Save
				</Button>
				<Button
					variant="outline"
					size="lg"
					className="h-12 text-base"
					onClick={() => toggleDayInfoModalState()}
				>
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
						!cheatMealChips.length &&
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
