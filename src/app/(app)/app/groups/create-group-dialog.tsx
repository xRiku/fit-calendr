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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { createGroup, type GroupDuration } from "@/actions/group-actions";
import { toast } from "sonner";
import { Plus, CalendarIcon } from "lucide-react";
import { format, addDays, addMonths, addYears, endOfYear } from "date-fns";
import { cn } from "@/lib/utils";

const DURATION_OPTIONS: {
	value: GroupDuration;
	label: string;
	description: string;
}[] = [
	{ value: "30d", label: "30 Dias", description: "Desafio de 1 mês" },
	{
		value: "90d",
		label: "90 Dias",
		description: "Desafio clássico de 3 meses",
	},
	{ value: "6m", label: "6 Meses", description: "Desafio de meio ano" },
	{
		value: "eoy",
		label: "Fim do Ano",
		description: `Até 31 de dez de ${new Date().getFullYear()}`,
	},
	{ value: "1y", label: "1 Ano", description: "Desafio de um ano inteiro" },
	{
		value: "custom",
		label: "Personalizado",
		description: "Escolha sua própria data final",
	},
];

function getPreviewEndDate(
	duration: GroupDuration,
	customDate?: Date,
): Date | null {
	const now = new Date();
	switch (duration) {
		case "30d":
			return addDays(now, 30);
		case "90d":
			return addDays(now, 90);
		case "6m":
			return addMonths(now, 6);
		case "eoy":
			return endOfYear(now);
		case "1y":
			return addYears(now, 1);
		case "custom":
			return customDate ?? null;
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
		case "SET_OPEN":
			return { ...state, open: action.open };
		case "SET_NAME":
			return { ...state, name: action.name };
		case "SET_DURATION":
			return { ...state, duration: action.duration };
		case "SET_CUSTOM_DATE":
			return { ...state, customDate: action.date };
		case "SET_CALENDAR_OPEN":
			return { ...state, calendarOpen: action.open };
		case "RESET":
			return initialState;
	}
}

export function CreateGroupDialog() {
	const router = useRouter();
	const [state, dispatch] = useReducer(reducer, initialState);
	const { open, name, duration, customDate, calendarOpen } = state;
	const [isPending, startTransition] = useTransition();

	const previewEnd = getPreviewEndDate(duration, customDate);
	const canSubmit =
		name.trim().length >= 2 && (duration !== "custom" || !!customDate);

	function handleSubmit() {
		startTransition(async () => {
			try {
				const group = await createGroup({
					name,
					duration,
					customEndDate: customDate,
				});
				toast.success(`"${group.name}" criado!`);
				dispatch({ type: "RESET" });
				router.push(`/app/groups/${group.id}`);
			} catch {
				toast.error("Falha ao criar grupo");
			}
		});
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => dispatch({ type: "SET_OPEN", open: o })}
		>
			<DialogTrigger asChild>
				<Button size="sm" className="gap-2">
					<Plus className="size-4" />
					Novo Grupo
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Criar um Grupo de Desafio</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-5 pt-2">
					<div className="flex flex-col gap-2">
						<Label htmlFor="group-name">Nome do grupo</Label>
						<Input
							id="group-name"
							placeholder="ex: Desafio de Verão 90 Dias"
							value={name}
							onChange={(e) =>
								dispatch({ type: "SET_NAME", name: e.target.value })
							}
							maxLength={60}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Duração</Label>
						<div className="grid grid-cols-2 gap-2">
							{DURATION_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() =>
										dispatch({ type: "SET_DURATION", duration: opt.value })
									}
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
							<Label>Data final</Label>
							<Popover
								open={calendarOpen}
								onOpenChange={(o) =>
									dispatch({ type: "SET_CALENDAR_OPEN", open: o })
								}
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
										{customDate
											? format(customDate, "PPP")
											: "Escolha uma data"}
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
							O desafio termina em{" "}
							<span className="text-white font-medium">
								{format(previewEnd, "MMMM d, yyyy")}
							</span>
						</p>
					)}

					<Button onClick={handleSubmit} disabled={!canSubmit || isPending}>
						{isPending ? "Criando…" : "Criar Grupo"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
