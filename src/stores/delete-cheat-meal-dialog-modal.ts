import { create } from "zustand";

export type DeleteConfirmationModalState = {
	isDeleteConfirmationModalOpened: boolean;
};
export type DeleteConfirmationModalAction = {
	toggleIsDeleteConfirmationModalOpened: () => void;
};

export type DeleteConfirmationModalStore = DeleteConfirmationModalState &
	DeleteConfirmationModalAction;

export const useDeleteConfirmationModalStore =
	create<DeleteConfirmationModalStore>((set) => ({
		isDeleteConfirmationModalOpened: false,
		toggleIsDeleteConfirmationModalOpened: () =>
			set((state) => ({
				isDeleteConfirmationModalOpened: !state.isDeleteConfirmationModalOpened,
			})),
	}));
