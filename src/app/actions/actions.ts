"use server";

import prisma from "@/lib/db";
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
