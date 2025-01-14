"use server";

import { auth, signIn, signOut } from "@/auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function addCheatMeal(formData: FormData) {
  const session = await auth();

  if (!session) {
    return;
  }

  await prisma.cheatMeal.create({
    data: {
      name: formData.get("mealName") as string,
      user: {
        connect: {
          id: session.user?.id,
        },
      },
    },
  });

  // revalidatePath("/", "page");
}

export async function updateCheatMeal({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) {
  const existingCheatMeal = await prisma.cheatMeal.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingCheatMeal) {
    throw new Error(`Cheat Meal with specified id: ${id} does not exist.`);
  }

  await prisma.cheatMeal.update({
    data: {
      name: formData.get("mealName") as string,
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
    select: {
      id: true,
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

export async function fetchCheatMealsByYearGroupedByMonth({
  id,
  year = new Date().getFullYear(),
}: {
  id: string;
  year: number;
}) {
  const data = await prisma.cheatMeal.findMany({
    where: {
      userId: id,
      date: {
        lte: new Date(year, 11, 31),
        gte: new Date(year, 0, 1),
      },
    },
  });

  const hashTable: { [key: number]: typeof data } = {};
  for (const item of data) {
    const date = new Date(item.date);
    const month = date.getUTCMonth();
    if (!hashTable[month]) {
      hashTable[month] = [item];
      continue;
    }

    hashTable[month].push(item);
  }

  return hashTable;
}

export async function fetchGymChecksByYearGroupedByMonth({
  id,
  year = new Date().getFullYear(),
}: {
  id: string;
  year: number;
}) {
  const data = await prisma.gymCheck.findMany({
    where: {
      userId: id,
      date: {
        lte: new Date(year, 11, 31),
        gte: new Date(year, 0, 1),
      },
    },
  });

  const hashTable: { [key: number]: typeof data } = {};
  for (const item of data) {
    const date = new Date(item.date);
    const month = date.getUTCMonth();
    if (!hashTable[month]) {
      hashTable[month] = [item];
      continue;
    }

    hashTable[month].push(item);
  }

  return hashTable;
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
