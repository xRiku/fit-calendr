"use server";

import prisma from "@/lib/db";
import { DatePeriod } from "@/types/enums";
import { sub, add } from "date-fns";
import { revalidatePath } from "next/cache";

export async function addCheatMeal(formData: unknown) {
  await prisma.cheatMeal.create({
    data: {
      name: formData.get("mealName"),
      period: formData.get("mealPeriod"),
      date: formData.get("mealDate"),
    },
  });

  revalidatePath("/", "page");
}

export async function getCheatMealsByDate(datePeriod: DatePeriod) {
  const today = new Date();

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

  if (datePeriod === DatePeriod.week) {
    const dateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const data = await prisma.cheatMeal.findMany({
      where: {
        date: {
          lt: add(dateOnly, {
            days: 1,
          }),
          gt: sub(dateOnly, {
            days: 7,
          }),
        },
      },
    });
    return data;
  }
}
