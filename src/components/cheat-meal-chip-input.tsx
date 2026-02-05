"use client";

import type { CheatMealPreset } from "@/../prisma/generated/client";
import { createCheatMealPreset } from "@/actions/preset-actions";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PRESET_COLORS } from "@/lib/constants/colors";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";

export type CheatMealChipInputRef = {
	flushInput: () => Promise<CheatMealChip | null>;
};

export type CheatMealChip = {
	id?: string;
	label: string;
	color: string;
	presetId?: string;
	isNew?: boolean;
};

type CheatMealChipInputProps = {
	presets: CheatMealPreset[];
	value: CheatMealChip[];
	onChange: (chips: CheatMealChip[]) => void;
	className?: string;
};

export const CheatMealChipInput = forwardRef<
	CheatMealChipInputRef,
	CheatMealChipInputProps
>(function CheatMealChipInput({ presets, value, onChange, className }, ref) {
	const [inputValue, setInputValue] = useState("");
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const inputValueRef = useRef(inputValue);
	const valueRef = useRef(value);
	const presetsRef = useRef(presets);
	const onChangeRef = useRef(onChange);

	inputValueRef.current = inputValue;
	valueRef.current = value;
	presetsRef.current = presets;
	onChangeRef.current = onChange;

	const filteredPresets = inputValue
		? presets.filter(
				(preset) =>
					preset.label.toLowerCase().includes(inputValue.toLowerCase()) &&
					!value.some((chip) => chip.presetId === preset.id),
			)
		: [];

	const duplicateChip = value.find(
		(chip) => chip.label.toLowerCase() === inputValue.toLowerCase(),
	);

	const handleSelect = useCallback(
		(preset: CheatMealPreset) => {
			if (value.some((chip) => chip.presetId === preset.id)) {
				return;
			}

			const newChip: CheatMealChip = {
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

	const handleInputChange = useCallback((newValue: string) => {
		setInputValue(newValue);
		setOpen(newValue.length > 0);
	}, []);

	const flushInput = useCallback(async (): Promise<CheatMealChip | null> => {
		const currentInput = inputValueRef.current.trim();
		if (!currentInput) return null;

		const currentDuplicate = valueRef.current.find(
			(chip) => chip.label.toLowerCase() === currentInput.toLowerCase(),
		);
		if (currentDuplicate) {
			setInputValue("");
			setOpen(false);
			return null;
		}

		const currentExactMatch = presetsRef.current.find(
			(preset) => preset.label.toLowerCase() === currentInput.toLowerCase(),
		);
		if (currentExactMatch) {
			if (
				!valueRef.current.some((chip) => chip.presetId === currentExactMatch.id)
			) {
				const newChip: CheatMealChip = {
					id: crypto.randomUUID(),
					label: currentExactMatch.label,
					color: currentExactMatch.color,
					presetId: currentExactMatch.id,
					isNew: false,
				};
				onChangeRef.current([...valueRef.current, newChip]);
				setInputValue("");
				setOpen(false);
				return newChip;
			}
			setInputValue("");
			setOpen(false);
			return null;
		}

		try {
			const randomColor =
				PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)].value;

			const newPreset = await createCheatMealPreset({
				label: currentInput,
				color: randomColor,
				order: presetsRef.current.length,
			});

			const newChip: CheatMealChip = {
				id: crypto.randomUUID(),
				label: newPreset.label,
				color: newPreset.color,
				presetId: newPreset.id,
				isNew: true,
			};

			onChangeRef.current([...valueRef.current, newChip]);
			setInputValue("");
			setOpen(false);
			toast.success(`Created new preset: ${newPreset.label}`);
			return newChip;
		} catch (error) {
			toast.error("Failed to create preset");
			console.error(error);
			return null;
		}
	}, []);

	useImperativeHandle(ref, () => ({
		flushInput,
	}));

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && inputValue) {
				e.preventDefault();
				flushInput();
			} else if (e.key === "Backspace" && !inputValue && value.length > 0) {
				onChange(value.slice(0, -1));
			} else if (e.key === "Escape") {
				setOpen(false);
			}
		},
		[inputValue, value, onChange, flushInput],
	);

	return (
		<div className={cn("space-y-2", className)}>
			{value.length > 0 && (
				<div className="flex flex-wrap gap-1.5">
					{value.map((chip) => (
						<Badge
							key={chip.id}
							variant="outline"
							className="gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-150 bg-transparent hover:bg-[color:var(--chip-color)]/10"
							style={{
								["--chip-color" as string]: chip.color,
								color: chip.color,
								borderColor: `${chip.color}4d`,
								backgroundColor: "transparent",
							}}
						>
							{chip.label}
							<button
								type="button"
								onClick={() =>
									chip.id && onChange(value.filter((c) => c.id !== chip.id))
								}
								className="ml-0.5 rounded-full p-0.5 opacity-50 hover:opacity-80 transition-opacity"
								style={{ color: chip.color }}
							>
								×
							</button>
						</Badge>
					))}
				</div>
			)}

			<div className="relative">
				<Input
					ref={inputRef}
					value={inputValue}
					onChange={(e) => handleInputChange(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={
						value.length === 0
							? "Type to search presets..."
							: "Add another cheat meal..."
					}
					className="w-full pr-10 bg-transparent border-neutral-200 dark:border-neutral-800"
				/>
				<Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />

				{open && inputValue && (
					<div className="absolute z-50 w-full mt-1 rounded-md border border-neutral-200 bg-white shadow-md dark:border-neutral-800 dark:bg-neutral-950">
						{filteredPresets.length === 0 && !duplicateChip ? (
							<button
								type="button"
								onClick={flushInput}
								className="flex w-full items-center px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-neutral-800"
							>
								Create &quot;{inputValue.trim()}&quot;
							</button>
						) : (
							<div className="py-1">
								{filteredPresets.map((preset) => (
									<button
										key={preset.id}
										type="button"
										onClick={() => handleSelect(preset)}
										className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-neutral-800"
									>
										<span
											className="size-3 rounded-full"
											style={{ backgroundColor: preset.color }}
										/>
										{preset.label}
									</button>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
});

CheatMealChipInput.displayName = "CheatMealChipInput";
