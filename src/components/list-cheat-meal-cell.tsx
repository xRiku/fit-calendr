import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import prisma from "@/lib/db";
import { DatePeriod } from "@/types/enums";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const today = new Date();

export async function ListCheatMealCell() {
  const getCheatMealsByDate = async (datePeriod: DatePeriod) => {
    "use server";

    if (datePeriod === DatePeriod.today) {
      const dateOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const data = await prisma.cheatMeal.findMany({
        where: {
          date: {
            gt: dateOnly,
          },
        },
      });
      return data;
    }
  };

  const cheatMeals = await getCheatMealsByDate(DatePeriod.today);

  return (
    <section className="flex flex-col border-2 p-10 w-full rounded-xl">
      <Select defaultValue="today">
        <div className="flex w-full items-center justify-between">
          <SelectTrigger className="flex w-8/12">
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <span className="font-mono">
            {today.toLocaleDateString(undefined, {
              dateStyle: "medium",
            })}
          </span>
        </div>
        <SelectContent>
          <SelectItem value="today">Today&apos;s cheat meal</SelectItem>
          <SelectItem value="week">This week&apos;s cheat meal</SelectItem>
          <SelectItem value="month">This month&apos;s cheat meal</SelectItem>
        </SelectContent>
      </Select>
      <Separator className="my-4" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/12">Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-center w-2/12">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cheatMeals?.map((cheatMeal) => (
            <TableRow key={cheatMeal.id}>
              <TableCell className="font-medium">{"category"}</TableCell>
              <TableCell className="font-medium">{cheatMeal.name}</TableCell>
              <TableCell className="text-center">
                {cheatMeal.date.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
