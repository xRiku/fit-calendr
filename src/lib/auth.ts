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

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	plugins: [
		nextCookies(),
		emailOTP({
			async sendVerificationOTP({ email, otp }) {
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
					await Promise.all([
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
