"use server-only";

import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import prisma from "./db";

export async function fetchCheatMealsByYearGroupedByMonth(params?: {
  year?: number;
}): Promise<{
  hashTable: { [key: string]: typeof data };
  count: number;
}> {
  const { year = new Date().getFullYear() } = params || {};

  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
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
