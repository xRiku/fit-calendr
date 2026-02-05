import type { CheatMeal, GymCheck } from "@/../prisma/generated/client";
import { create } from "zustand";

export type SelectedDayInfo = {
	cheatMeals: (Omit<CheatMeal, "date"> & { presetColor?: string | null })[];
	gymChecks: (Omit<GymCheck, "date"> & { presetColor?: string | null })[];
	date: Date;
};

export type ModalState = {
	dayInfoModalState: boolean;
	dayInfoType: "create" | "edit";
	selectedDayInfo?: SelectedDayInfo;
};

export type ModalActions = {
	toggleDayInfoModalState: (dayInfoType?: "create" | "edit") => void;
	setSelectedDayInfo: (dayInfo: SelectedDayInfo) => void;
};

export type ModalStore = ModalState & ModalActions;

export const useModalStore = create<ModalStore>((set) => ({
	dayInfoModalState: false,
	dayInfoType: "create",
	selectedDayInfo: undefined,

	setSelectedDayInfo: (dayInfo: SelectedDayInfo) =>
		set(() => ({
			selectedDayInfo: dayInfo,
		})),
	toggleDayInfoModalState: (dayInfoType = "create") =>
		set((state) => {
			const isOpening = !state.dayInfoModalState;
			return {
				dayInfoModalState: !state.dayInfoModalState,
				...(isOpening && { dayInfoType }),
			};
		}),
}));
