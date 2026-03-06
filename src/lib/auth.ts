import { env } from "@/env";
import {
  DEFAULT_CHEAT_MEAL_PRESETS,
  DEFAULT_WORKOUT_PRESETS,
} from "@/lib/constants/colors";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import prisma from "./db";

const ADJECTIVES = [
  "swift",
  "bold",
  "calm",
  "keen",
  "iron",
  "vast",
  "pure",
  "epic",
  "wild",
  "firm",
  "free",
  "true",
  "bright",
  "strong",
  "sharp",
  "brave",
];
const NOUNS = [
  "lion",
  "wolf",
  "bear",
  "hawk",
  "tiger",
  "eagle",
  "panther",
  "fox",
  "falcon",
  "cobra",
  "shark",
  "bison",
  "jaguar",
  "rhino",
  "lynx",
  "ox",
];

async function generateUniqueUsername(): Promise<string> {
  for (let attempts = 0; attempts < 10; attempts++) {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    const username = `${adj}-${noun}-${num}`;
    const existing = await prisma.user.findUnique({ where: { username } });
    if (!existing) return username;
  }
  // Fallback: timestamp-based
  return `user-${Date.now()}`;
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    nextCookies(),
    emailOTP({
      ...(process.env.NODE_ENV !== "production" && {
        generateOTP: () => "000000",
      }),
      async sendVerificationOTP({ email, otp }) {
        if (process.env.NODE_ENV !== "production") {
          return; // OTP is always "0000" in dev — no email needed
        }
        await fetch(`${env.BETTER_AUTH_URL}/api/send`, {
          method: "POST",
          body: JSON.stringify({
            email,
            otp,
          }),
          headers: new Headers({
            "Content-Type": "application/json",
          }),
        });
      },
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const username = await generateUniqueUsername();
          await Promise.all([
            prisma.user.update({ where: { id: user.id }, data: { username } }),
            ...DEFAULT_WORKOUT_PRESETS.map((preset) =>
              prisma.workoutPreset.create({
                data: { ...preset, userId: user.id },
              }),
            ),
            ...DEFAULT_CHEAT_MEAL_PRESETS.map((preset) =>
              prisma.cheatMealPreset.create({
                data: { ...preset, userId: user.id },
              }),
            ),
          ]);
        },
      },
    },
  },
});
