import prisma from "@/lib/db";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFormData = authSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null;
        }

        const { email, password } = validatedFormData.data;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          console.log("No user found");
          return null;
        }

        const passwordsMatch = await compare(password, user.hashedPassword);

        if (!passwordsMatch) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnMarketingPage = nextUrl.pathname === "/";
      const isOnPublicPages =
        nextUrl.pathname.startsWith("/auth") || isOnMarketingPage;
      const isOnPrivatePages = !isOnPublicPages;

      if (isLoggedIn && isOnPublicPages) {
        return Response.redirect(new URL("/app/dashboard", nextUrl));
      }

      if (!isLoggedIn && isOnPublicPages) {
        return true;
      }

      if (isLoggedIn && isOnPrivatePages) {
        return true;
      }

      if (!isLoggedIn && isOnPrivatePages) {
        return false;
      }

      return false;
    },

    session({ session, token }) {
      session.user.id = token.sub;

      return session;
    },
  },
} satisfies NextAuthConfig;
