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

  let cheatMealResponse = undefined;
  let gymCheckResponse = undefined;

  if (formData.get("cheatMealName")) {
    cheatMealResponse = await prisma.cheatMeal.create({
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
    gymCheckResponse = await prisma.gymCheck.create({
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

  revalidatePath("/app/calendar", "page");
  return {
    cheatMealResponse,
    gymCheckResponse,
  };
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
      return await prisma.cheatMeal.delete({
        where: {
          id: cheatMealId,
        },
      });
    }

    return await prisma.cheatMeal.update({
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
    return await prisma.gymCheck.create({
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
      return await prisma.gymCheck.delete({
        where: {
          id: gymCheckId,
        },
      });
    }
    return await prisma.gymCheck.update({
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
  cheatMealName,
  workoutDescription,
  date,
}: {
  gymCheckId?: string;
  cheatMealId?: string;
  cheatMealName?: string;
  workoutDescription?: string;
  date: Date;
}) {
  const session = await auth();

  if (!session) {
    return;
  }

  let cheatMealResponse = undefined;
  let gymCheckResponse = undefined;

  if (cheatMealName !== undefined) {
    cheatMealResponse = await updateCheatMealInfo({
      userId: session.user.id,
      cheatMealId,
      cheatMealName,
      date: date,
    });
  }

  if (workoutDescription !== undefined) {
    gymCheckResponse = await updateGymCheckInfo({
      userId: session.user.id,
      gymCheckId,
      workoutDescription,
      date: date,
    });
  }

  revalidatePath("/app/calendar", "page");

  return {
    cheatMealResponse,
    gymCheckResponse,
  };
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

export async function fetchCheatMealsByYearGroupedByMonth(params?: {
  year?: number;
}): Promise<{
  hashTable: { [key: number]: typeof data };
  count: number;
}> {
  const { year = new Date().getFullYear() } = params || {};

  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const data = await prisma.cheatMeal.findMany({
    where: {
      userId: session.user.id,
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

  return { hashTable, count: data.length };
}

export async function fetchGymChecksByYearGroupedByMonth(params?: {
  year?: number;
}): Promise<{
  hashTable: { [key: string]: typeof data };
  count: number;
}> {
  const { year = new Date().getFullYear() } = params || {};
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const data = await prisma.gymCheck.findMany({
    where: {
      userId: session.user.id,
      date: {
        lte: new Date(year ?? new Date().getFullYear(), 11, 31),
        gte: new Date(year ?? new Date().getFullYear(), 0, 1),
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

  return { hashTable, count: data.length };
}

export async function getLastCheatMeal() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }
  const data = prisma.cheatMeal.findMany({
    where: {
      userId: session.user.id,
      date: {
        lte: new Date(),
      },
    },
    orderBy: {
      date: "desc",
    },
    take: 1,
  });

  return data;
}

export async function getLastGymWorkout() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }
  const data = prisma.gymCheck.findMany({
    where: {
      userId: session.user.id,
      date: {
        lte: new Date(),
      },
    },
    orderBy: {
      date: "desc",
    },
    take: 1,
  });

  return data;
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
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10
  );
  return await prisma.user.create({
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
