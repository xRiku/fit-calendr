import Cells from "@/components/cells";
import { ListCheatMealCell } from "@/components/list-cheat-meal-cell";
import CheatMealDialog from "@/components/cheat-meal-dialog";

export default function Home() {
  return (
    <main className="flex flex-col items-start justify-center w-11/12 mx-auto ">
      <Cells />
      <div className="mt-4 w-10/12 gap-4 flex items-start justify-between">
        <ListCheatMealCell />
        <CheatMealDialog />
      </div>
    </main>
  );
}
