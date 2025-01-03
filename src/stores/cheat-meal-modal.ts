import { create } from "zustand";

export type ModalState = {
  cheatMealModalState: boolean;
  mealType: "create" | "edit";
};

export type ModalActions = {
  toggleCheatMealModalState: (mealType?: "create" | "edit") => void;
};

export type ModalStore = ModalState & ModalActions;

export const useModalStore = create<ModalStore>((set) => ({
  cheatMealModalState: false,
  mealType: "create",
  toggleCheatMealModalState: (mealType = "create") =>
    set((state) => ({
      cheatMealModalState: !state.cheatMealModalState,
      mealType,
    })),
}));
