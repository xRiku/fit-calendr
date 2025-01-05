"use client";
import { useDeleteConfirmationModalStore } from "@/stores/delete-cheat-meal-dialog-modal";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { deleteCheatMeal } from "@/app/actions/actions";
import { useModalStore } from "@/stores/cheat-meal-modal";

export function DeleteCheatMealConfirmationDialog() {
  const { selectedCheatMeal } = useModalStore();

  const {
    isDeleteConfirmationModalOpened,
    toggleIsDeleteConfirmationModalOpened,
  } = useDeleteConfirmationModalStore();

  const handleDelete = async () => {
    if (!selectedCheatMeal) {
      return;
    }
    await deleteCheatMeal(selectedCheatMeal.id);
  };

  return (
    <AlertDialog
      open={isDeleteConfirmationModalOpened}
      onOpenChange={toggleIsDeleteConfirmationModalOpened}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Cheat Meal</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            cheat meal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
