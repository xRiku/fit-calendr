import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import prisma from "./db";
import { env } from "@/env";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        console.log(env.BETTER_AUTH_URL);
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
