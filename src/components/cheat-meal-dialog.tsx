"use client";

import {
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import MealForm from "./meal-form";
import { Plus } from "lucide-react";
import { useState } from "react";

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
        <DialogHeader>
          <DialogTitle className="font-extrabold text-2xl">
            Add cheat meal
          </DialogTitle>
          <DialogDescription>
            Add the details of your cheat meal here. They are optional, but can
            be useful for analytics.
          </DialogDescription>
        </DialogHeader>
        <MealForm onFormSubmission={() => setIsDialogOpen(false)} />
        <DialogFooter className="flex sm:justify-center gap-4">
          <Button variant="outline" className="w-1/4">
            Cancel
          </Button>
          <Button form="create-meal-form" type="submit" className="w-1/4">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
