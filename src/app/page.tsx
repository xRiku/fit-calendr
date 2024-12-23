import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import Cells from "@/components/cells";
import CreateMealForm from "@/components/create-meal-form";
import { ListCheatMealCell } from "@/components/list-cheat-meal-cell";

export default function Home() {
  return (
    <main className="flex flex-col items-start justify-center w-11/12 mx-auto ">
      <Cells />
      <div className="mt-4 w-10/12 gap-4 flex items-start justify-between">
        <ListCheatMealCell />
        <Dialog>
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
                Add the details of your cheat meal here. They are optional, but
                can be useful for analytics.
              </DialogDescription>
            </DialogHeader>
            <CreateMealForm />
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
      </div>
    </main>
  );
}
