"use client";

import {
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import MealForm from "./meal-form";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CheatMealDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button asChild variant="ghost">
          <Plus className="h-32 w-32 text-green-600 dark:hover:text-green-400 hover:text-green-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader aria-describedby="Cheat Meal Form">
          <DialogTitle className="font-extrabold text-2xl">
            Add cheat meal
          </DialogTitle>
        </DialogHeader>
        <MealForm onFormSubmission={() => setIsDialogOpen(false)} />
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
