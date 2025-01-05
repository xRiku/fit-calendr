import { ListCheatMealCell } from "@/components/list-cheat-meal-cell";
import CheatMealDialog from "@/components/cheat-meal-dialog";
import { DeleteCheatMealConfirmationDialog } from "@/components/delete-cheat-meal-confirmation-dialog";

export default function Home() {
  return (
    <main className="flex flex-col items-start justify-center w-11/12 mx-auto ">
      <div className="mt-4 w-10/12 gap-4 flex items-start justify-between">
        <ListCheatMealCell />
        <CheatMealDialog />
        <DeleteCheatMealConfirmationDialog />
      </div>
    </main>
  );
}
