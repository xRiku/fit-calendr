import { env } from "@/env";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import prisma from "./db";

const DEFAULT_PRESETS = [
	{ label: "Leg Day", color: "#ef4444", order: 0 },
	{ label: "Chest Day", color: "#f97316", order: 1 },
	{ label: "Back Day", color: "#3b82f6", order: 2 },
	{ label: "Swimming", color: "#06b6d4", order: 3 },
	{ label: "Running", color: "#22c55e", order: 4 },
	{ label: "Calisthenics", color: "#a855f7", order: 5 },
];

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
					// Create default workout presets for new user
					await Promise.all(
						DEFAULT_PRESETS.map((preset) =>
							prisma.workoutPreset.create({
								data: {
									...preset,
									userId: user.id,
								},
							}),
						),
					);
				},
			},
		},
	},
});
