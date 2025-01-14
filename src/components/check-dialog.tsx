"use client";

import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import DayInfoForm from "./day-info-form";
import { toast } from "sonner";
import { useModalStore } from "@/stores/cheat-meal-modal";
import { DialogDescription } from "@radix-ui/react-dialog";
import { format } from "date-fns";

export default function CheckDialog() {
  const { cheatMealModalState, toggleCheatMealModalState, mealType } =
    useModalStore();

  return (
    <Dialog
      open={cheatMealModalState}
      onOpenChange={() => toggleCheatMealModalState()}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader aria-describedby="Day Info Form">
          <DialogTitle className="font-extrabold text-2xl">
            {mealType === "create" && "Add info for the day"}
            {mealType === "edit" && "Edit info for the day"}
          </DialogTitle>
          <DialogDescription>
            {/* to fix */}
            {format(new Date(), "dd/MM/yyyy")}
          </DialogDescription>
        </DialogHeader>
        <DayInfoForm onFormSubmission={() => toggleCheatMealModalState()} />
        <DialogFooter className="flex sm:justify-center gap-4">
          <DialogClose asChild>
            <Button variant="outline" className="w-1/4">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() =>
              toast("Cheat meal added", {
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo"),
                },
              })
            }
            form="meal-form"
            type="submit"
            className="w-1/4"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
