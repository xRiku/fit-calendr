"use client";

import type { WorkoutPreset } from "@/../prisma/generated/client";
import { createPreset } from "@/actions/preset-actions";
import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { PRESET_COLORS } from "@/lib/constants/colors";
import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export type WorkoutChip = {
	id?: string;
	label: string;
	color: string;
	presetId?: string;
	isNew?: boolean;
};

type WorkoutChipInputProps = {
	presets: WorkoutPreset[];
	value: WorkoutChip[];
	onChange: (chips: WorkoutChip[]) => void;
	className?: string;
};

export function WorkoutChipInput({
	presets,
	value,
	onChange,
	className,
}: WorkoutChipInputProps) {
	const [inputValue, setInputValue] = useState("");
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Filter presets based on input
	const filteredPresets = presets.filter(
		(preset) =>
			preset.label.toLowerCase().includes(inputValue.toLowerCase()) &&
			!value.some((chip) => chip.presetId === preset.id),
	);

	// Check if input matches an existing preset exactly
	const exactMatch = presets.find(
		(preset) => preset.label.toLowerCase() === inputValue.toLowerCase(),
	);

	const handleSelect = useCallback(
		(preset: WorkoutPreset) => {
			const newChip: WorkoutChip = {
				id: crypto.randomUUID(),
				label: preset.label,
				color: preset.color,
				presetId: preset.id,
				isNew: false,
			};
			onChange([...value, newChip]);
			setInputValue("");
			setOpen(false);
			inputRef.current?.focus();
		},
		[value, onChange],
	);

	const handleCreateNew = useCallback(async () => {
		if (!inputValue.trim()) return;

		// If exact match exists, use it instead of creating new
		if (exactMatch) {
			handleSelect(exactMatch);
			return;
		}

		try {
			// Create new preset with random color from palette
			const randomColor =
				PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)].value;

			const newPreset = await createPreset({
				label: inputValue.trim(),
				color: randomColor,
				order: presets.length,
			});

			const newChip: WorkoutChip = {
				id: crypto.randomUUID(),
				label: newPreset.label,
				color: newPreset.color,
				presetId: newPreset.id,
				isNew: true,
			};

			onChange([...value, newChip]);
			setInputValue("");
			setOpen(false);
			toast.success(`Created new preset: ${newPreset.label}`);
		} catch (error) {
			toast.error("Failed to create preset");
			console.error(error);
		}
	}, [inputValue, exactMatch, handleSelect, presets.length, value, onChange]);

	const handleRemove = useCallback(
		(chipId: string) => {
			onChange(value.filter((chip) => chip.id !== chipId));
		},
		[value, onChange],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && inputValue) {
				e.preventDefault();
				handleCreateNew();
			} else if (e.key === "Backspace" && !inputValue && value.length > 0) {
				// Remove last chip on backspace when input is empty
				onChange(value.slice(0, -1));
			}
		},
		[inputValue, value, onChange, handleCreateNew],
	);

	return (
		<div className={cn("relative", className)}>
			<Command className="overflow-visible bg-transparent">
				<div className="flex flex-wrap items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2 py-1.5 dark:border-stone-800 dark:bg-stone-950 min-h-[42px]">
					{/* Chips */}
					{value.map((chip) => (
						<Badge
							key={chip.id}
							variant="secondary"
							className="gap-1 px-2 py-1 text-xs"
							style={{
								backgroundColor: chip.color,
								color: "#ffffff",
								borderColor: chip.color,
							}}
						>
							{chip.label}
							<button
								type="button"
								onClick={() => chip.id && handleRemove(chip.id)}
								className="ml-1 rounded-full p-0.5 hover:bg-white/20"
							>
								×
							</button>
						</Badge>
					))}

					{/* Input */}
					<CommandInput
						ref={inputRef}
						value={inputValue}
						onValueChange={setInputValue}
						onKeyDown={handleKeyDown}
						onFocus={() => setOpen(true)}
						placeholder={value.length === 0 ? "Type and press Enter..." : ""}
						className="flex-1 bg-transparent border-0 px-1 py-0.5 text-sm placeholder:text-stone-500 focus:ring-0 dark:placeholder:text-stone-400 min-w-[120px]"
					/>
				</div>

				{/* Dropdown */}
				{open && (inputValue || filteredPresets.length > 0) && (
					<div className="absolute z-50 w-full mt-1 rounded-md border border-stone-200 bg-white shadow-md dark:border-stone-800 dark:bg-stone-950">
						<CommandList>
							<CommandEmpty>
								{inputValue ? (
									<button
										type="button"
										onClick={handleCreateNew}
										className="flex w-full items-center px-2 py-1.5 text-sm text-stone-900 hover:bg-stone-100 dark:text-stone-50 dark:hover:bg-stone-800"
									>
										Create &quot;{inputValue.trim()}&quot;
									</button>
								) : (
									<span className="px-2 py-1.5 text-sm text-stone-500 dark:text-stone-400">
										No presets found
									</span>
								)}
							</CommandEmpty>
							<CommandGroup>
								{filteredPresets.map((preset) => (
									<CommandItem
										key={preset.id}
										onSelect={() => handleSelect(preset)}
										className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm"
									>
										<span
											className="size-3 rounded-full"
											style={{ backgroundColor: preset.color }}
										/>
										{preset.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</div>
				)}
			</Command>
		</div>
	);
}
