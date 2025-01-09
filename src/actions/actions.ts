"use server";

import { auth, signIn, signOut } from "@/auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { redirect } from "next/navigation";

export async function addCheatMeal(formData: unknown) {
  const session = await auth();

  if (!session) {
    return;
  }

  await prisma.cheatMeal.create({
    data: {
      name: formData.get("mealName"),
      user: {
        connect: {
          id: session.user?.id,
        },
      },
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

export async function getCheatMeals() {
  const session = await auth();

  if (!session) {
    return;
  }

  const data = await prisma.cheatMeal.findMany({
    where: {
      userId: session.user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}

// Auth

export async function signInWithCredentials(data: FormData) {
  const authData = Object.fromEntries(data.entries());
  await signIn("credentials", authData);
}

export async function logOut() {
  await signOut({ redirectTo: "/auth/signin" });
}

export async function createUser(formData: FormData) {
  console.log(formData);
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10
  );
  await prisma.user.create({
    data: {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      hashedPassword,
    },
  });
}

export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return session;
}
