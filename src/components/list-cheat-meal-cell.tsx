import { Filter, Moon, Sun, Sunrise, Sunset } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import prisma from "@/lib/db";
import { DatePeriod, DayPeriod } from "@/types/enums";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

const today = new Date();

export function mapTimePeriodEnumToIcon(period: DayPeriod | null) {
  console.log(period);

  switch (period) {
    case DayPeriod.dawn:
      return <Sunrise />;
    case DayPeriod.morning:
      return <Sun />;
    case DayPeriod.afternoon:
      return <Sunset />;
    case DayPeriod.night:
      return <Moon />;
    default:
      return "No period specified.";
  }
}

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
            <TableHead className="w-2/12">Category</TableHead>
            <TableHead className="w-2/12">Day Period</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center w-2/12">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cheatMeals?.map((cheatMeal) => (
            <TableRow key={cheatMeal.id}>
              <TableCell>
                <Badge variant="outline" className="bg-green-300/80">
                  Hamburger
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {mapTimePeriodEnumToIcon(cheatMeal.period)}
              </TableCell>
              <TableCell className=" font-medium">{cheatMeal.name}</TableCell>
              <TableCell className="text-center">
                {format(cheatMeal.date, "dd/MM/yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
