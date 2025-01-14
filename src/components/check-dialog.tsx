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
import { useModalStore } from "@/stores/day-info-modal";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function CheckDialog() {
  const {
    dayInfoModalState,
    toggleDayInfoModalState,
    dayInfoType,
    selectedDayInfo,
  } = useModalStore();

  return (
    <Dialog
      open={dayInfoModalState}
      onOpenChange={() => toggleDayInfoModalState()}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader aria-describedby="Day Info Form">
          <DialogTitle className="font-extrabold text-2xl">
            {dayInfoType === "create" && "Add info for the day"}
            {dayInfoType === "edit" && "Edit info for the day"}
          </DialogTitle>
          <DialogDescription>
            {selectedDayInfo?.date.toDateString()}
          </DialogDescription>
        </DialogHeader>
        <DayInfoForm />
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
            form="day-info-form"
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
