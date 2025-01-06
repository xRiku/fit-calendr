"use server";

import prisma from "@/lib/db";
import { DatePeriod } from "@/types/enums";
import { sub, add } from "date-fns";
import { revalidatePath } from "next/cache";

export async function addCheatMeal(formData: unknown) {
  await prisma.cheatMeal.create({
    data: {
      name: formData.get("mealName"),
    },
  });

  // revalidatePath("/", "page");
}

export async function updateCheatMeal({ id, formData }: unknown) {
  console.log("id", id);
  console.log("formData", formData);

  await prisma.cheatMeal.update({
    data: {
      name: formData.get("mealName"),
    },
    where: {
      id,
    },
  });

  // revalidatePath("/", "page");
}

export async function deleteCheatMeal(id: string) {
  const existingCheatMeal = await prisma.cheatMeal.findUnique({
    where: {
      id,
    },
  });

  if (!existingCheatMeal) {
    throw new Error(`Cheat Meal with specified id: ${id} does not exist.`);
  }

  await prisma.cheatMeal.delete({
    where: {
      id,
    },
  });
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
        createdAt: {
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
        createdAt: {
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
