import { env } from "@/env";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import prisma from "./db";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "sqlite",
		// provider: "postgresql",
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
});
