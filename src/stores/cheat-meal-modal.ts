import type { CheatMeal } from "@prisma/client";
import { create } from "zustand";

export type ModalState = {
  cheatMealModalState: boolean;
  mealType: "create" | "edit";
  editingCheatMeal?: CheatMeal;
};

export type ModalActions = {
  toggleCheatMealModalState: (mealType?: "create" | "edit") => void;
  setEditingCheatMeal: (cheatMeal: CheatMeal) => void;
};

export type ModalStore = ModalState & ModalActions;

export const useModalStore = create<ModalStore>((set) => ({
  cheatMealModalState: false,
  mealType: "create",
  editingCheatMeal: undefined,

  setEditingCheatMeal: (cheatMeal: CheatMeal) =>
    set(() => ({
      editingCheatMeal: cheatMeal,
    })),
  toggleCheatMealModalState: (mealType = "create") =>
    set((state) => ({
      cheatMealModalState: !state.cheatMealModalState,
      mealType,
    })),
}));
