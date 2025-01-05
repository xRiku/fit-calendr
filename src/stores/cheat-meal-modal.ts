import type { CheatMeal } from "@prisma/client";
import { create } from "zustand";

export type ModalState = {
  cheatMealModalState: boolean;
  mealType: "create" | "edit";
  selectedCheatMeal?: CheatMeal;
};

export type ModalActions = {
  toggleCheatMealModalState: (mealType?: "create" | "edit") => void;
  setSelectedCheatMeal: (cheatMeal: CheatMeal) => void;
};

export type ModalStore = ModalState & ModalActions;

export const useModalStore = create<ModalStore>((set) => ({
  cheatMealModalState: false,
  mealType: "create",
  selectedCheatMeal: undefined,

  setSelectedCheatMeal: (cheatMeal: CheatMeal) =>
    set(() => ({
      selectedCheatMeal: cheatMeal,
    })),
  toggleCheatMealModalState: (mealType = "create") =>
    set((state) => ({
      cheatMealModalState: !state.cheatMealModalState,
      mealType,
    })),
}));
