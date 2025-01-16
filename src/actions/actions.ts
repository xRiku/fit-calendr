"use server";

import { auth, signIn, signOut } from "@/auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addDayInfo({
  formData,
  date,
}: {
  formData: FormData;
  date: Date;
}) {
  const session = await auth();

  if (!session) {
    return;
  }

  if (formData.get("cheatMealName")) {
    await prisma.cheatMeal.create({
      data: {
        name: formData.get("cheatMealName") as string,
        date: date,
        user: {
          connect: {
            id: session.user?.id,
          },
        },
      },
    });
  }

  if (formData.get("workoutDescription")) {
    await prisma.gymCheck.create({
      data: {
        description: formData.get("workoutDescription") as string,
        date,
        user: {
          connect: {
            id: session.user?.id,
          },
        },
      },
    });
  }

  revalidatePath("/app/dashboard", "page");
}

export async function updateCheatMealInfo({
  userId,
  cheatMealName,
  cheatMealId,
  date,
}: {
  userId: string;
  cheatMealName?: string;
  cheatMealId?: string;
  date: Date;
}) {
  if (!cheatMealId && cheatMealName !== "") {
    await prisma.cheatMeal.create({
      data: {
        name: cheatMealName as string,
        date: date,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return;
  }

  if (cheatMealId) {
    const existingCheatMeal = await prisma.cheatMeal.findUnique({
      where: {
        id: cheatMealId,
      },
      select: {
        id: true,
      },
    });

    if (!existingCheatMeal) {
      throw new Error(
        `Cheat Meal with specified id: ${cheatMealId} does not exist.`
      );
    }
    if (cheatMealName === "") {
      console.log("cheatMealId", cheatMealId);
      await prisma.cheatMeal.delete({
        where: {
          id: cheatMealId,
        },
      });
      return;
    }

    await prisma.cheatMeal.update({
      data: {
        name: cheatMealName,
      },
      where: {
        id: cheatMealId,
      },
    });
  }
}

export async function updateGymCheckInfo({
  userId,
  workoutDescription,
  gymCheckId,
  date,
}: {
  userId: string;
  workoutDescription?: string;
  gymCheckId?: string;
  date: Date;
}) {
  if (!gymCheckId && workoutDescription !== "") {
    await prisma.gymCheck.create({
      data: {
        description: workoutDescription as string,
        date: date,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return;
  }

  if (gymCheckId) {
    const existingGymCheck = await prisma.gymCheck.findUnique({
      where: {
        id: gymCheckId,
      },
      select: {
        id: true,
      },
    });

    if (!existingGymCheck) {
      throw new Error(
        `Gym check with specified id: ${gymCheckId} does not exist.`
      );
    }
    if (workoutDescription === "") {
      await prisma.gymCheck.delete({
        where: {
          id: gymCheckId,
        },
      });
      return;
    }
    await prisma.gymCheck.update({
      data: {
        description: workoutDescription,
      },
      where: {
        id: gymCheckId,
      },
    });
  }
}

export async function updateDayInfo({
  gymCheckId,
  cheatMealId,
  formData,
  date,
}: {
  gymCheckId?: string;
  cheatMealId?: string;
  formData: FormData;
  date: Date;
}) {
  const session = await auth();

  if (!session) {
    return;
  }

  const cheatMealName = formData.get("cheatMealName") as string;
  const workoutDescription = formData.get("workoutDescription") as string;

  if (cheatMealName !== undefined) {
    await updateCheatMealInfo({
      userId: session.user.id,
      cheatMealId,
      cheatMealName,
      date: date,
    });
  }

  if (workoutDescription !== undefined) {
    await updateGymCheckInfo({
      userId: session.user.id,
      gymCheckId,
      workoutDescription,
      date: date,
    });
  }

  revalidatePath("/app/dashboard", "page");
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
  await signIn("credentials", { redirectTo: "/app/dashboard", ...authData });
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
