"use client";

import {
  Filter,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Trash,
  PenSquare,
} from "lucide-react";
import { format, sub } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
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
import { useEffect, useState } from "react";
import { getCheatMealsByDate } from "@/app/actions/actions";
import type { CheatMeal } from "@prisma/client";
import { Button } from "./ui/button";
import { useModalStore } from "@/stores/cheat-meal-modal";
import { useDeleteConfirmationModalStore } from "@/stores/delete-cheat-meal-dialog-modal";

const today = new Date();

export function mapTimePeriodEnumToIcon(period: DayPeriod | null) {
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

export function ListCheatMealCell() {
  const { toggleCheatMealModalState, setSelectedCheatMeal } = useModalStore();
  const { toggleIsDeleteConfirmationModalOpened } =
    useDeleteConfirmationModalStore();
  const [cheatMeals, setCheatMeals] = useState<CheatMeal[]>([]);
  const [selectedDatePeriod, setSelectedDatePeriod] = useState(
    DatePeriod.today
  );

  function resolveDateString(datePeriod: DatePeriod): string {
    switch (datePeriod) {
      case DatePeriod.week:
        return `${sub(today, {
          days: 7,
        }).toLocaleDateString(undefined, {
          dateStyle: "medium",
        })} - ${today.toLocaleDateString(undefined, {
          dateStyle: "medium",
        })}`;
      case DatePeriod.month:
        return `${today.toLocaleDateString(undefined, {
          dateStyle: "short",
        })}`;
      default:
        return `${today.toLocaleDateString(undefined, {
          dateStyle: "medium",
        })}`;
    }
  }

  const handleDeleteCheatMeal = (editingCheatMeal: CheatMeal) => {
    setSelectedCheatMeal(editingCheatMeal);
    toggleIsDeleteConfirmationModalOpened();
  };

  const handleEditCheatMeal = (editingCheatMeal: CheatMeal) => {
    setSelectedCheatMeal(editingCheatMeal);
    toggleCheatMealModalState("edit");
  };

  useEffect(() => {
    async function fetchCheatMeals() {
      const data = await getCheatMealsByDate(selectedDatePeriod);
      if (data) {
        setCheatMeals(data);
      }
    }

    fetchCheatMeals();
  }, [selectedDatePeriod]);

  return (
    <section className="flex flex-col border-2 p-10 w-full rounded-xl">
      <Select
        value={selectedDatePeriod}
        defaultValue={selectedDatePeriod}
        onValueChange={(value: DatePeriod) => setSelectedDatePeriod(value)}
      >
        <div className="flex w-full items-center justify-between">
          <SelectTrigger className="flex w-8/12">
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <span className="font-mono">
            {resolveDateString(selectedDatePeriod)}
          </span>
        </div>
        <SelectContent>
          <SelectItem value={DatePeriod.today}>
            Today&apos;s cheat meal
          </SelectItem>
          <SelectItem value={DatePeriod.week}>
            This week&apos;s cheat meal
          </SelectItem>
          <SelectItem value={DatePeriod.month}>
            This month&apos;s cheat meal
          </SelectItem>
        </SelectContent>
      </Select>
      <Separator className="my-4" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/12">Category</TableHead>
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
              <TableCell className=" font-medium">{cheatMeal.name}</TableCell>
              <TableCell className="text-center">
                {format(cheatMeal.createdAt, "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="w-[5%] p-0">
                <Button
                  variant="ghost"
                  onClick={() => handleEditCheatMeal(cheatMeal)}
                >
                  <PenSquare className="w-6 h-6 " />
                </Button>
              </TableCell>
              <TableCell className="w-[5%] p-0">
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteCheatMeal(cheatMeal)}
                >
                  <Trash className="h-6 w-6 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
