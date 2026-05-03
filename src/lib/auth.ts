import { env } from "@/env";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { bearer, emailOTP } from "better-auth/plugins";
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

const TRUSTED_LOCAL_ORIGINS = [
	"http://localhost:3000",
	"http://localhost:3001",
	"http://localhost:8081",
	"http://localhost:8082",
	"http://localhost:19006",
	"http://127.0.0.1:3000",
	"http://127.0.0.1:3001",
	"http://127.0.0.1:8081",
	"http://127.0.0.1:8082",
	"http://127.0.0.1:19006",
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
	trustedOrigins: [env.BETTER_AUTH_URL, ...TRUSTED_LOCAL_ORIGINS],
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	plugins: [
		nextCookies(),
		bearer(),
		emailOTP({
			...(process.env.NODE_ENV !== "production" && {
				generateOTP: () => "000000",
			}),
			async sendVerificationOTP({ email, otp }) {
				if (process.env.NODE_ENV !== "production") {
					console.log(`[DEV] OTP for ${email}: ${otp}`);
					return; // OTP is always "000000" in dev — no email needed
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
					await prisma.user.update({
						where: { id: user.id },
						data: { username },
					});
				},
			},
		},
	},
});
