"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/db";
import { DatePeriod } from "@/types/enums";
import { sub, add } from "date-fns";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function addCheatMeal(formData: unknown) {
  await prisma.cheatMeal.create({
    data: {
      name: formData.get("mealName"),
    },
  });

  // revalidatePath("/", "page");
}

export async function updateCheatMeal({ id, formData }: unknown) {
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

// Auth

// const signInFormSchema = z.object({
//   email: z.string().email({message: "Please enter a valid email address"})
// })

export async function signInWithEmail(data: FormData) {
  const authData = Object.entries(data.entries());
  await signIn("credentials", authData);
}

export async function createUser(formData: FormData) {
  console.log(formData);
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    6
  );
  await prisma.user.create({
    data: {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      hashedPassword,
    },
  });
}
