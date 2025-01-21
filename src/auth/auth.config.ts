import prisma from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { z } from "zod";
import { env } from "@/env";

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

        const passwordsMatch = await compare(
          password,
          user.hashedPassword || ""
        );

        if (!passwordsMatch) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const googleProfile = profile as GoogleProfile;
        const emailDomain = googleProfile.email.match(/@([^@]+)$/);

        if (!emailDomain) {
          return false;
        }

        if (googleProfile.email_verified) {
          const userExist = await prisma.user.findMany({
            where: {
              email: googleProfile.email,
            },
          });

          if (userExist.length === 0) {
            await prisma.user.create({
              data: {
                email: googleProfile.email,
                name: googleProfile.name,
              },
            });
          }
          return true;
        }

        return false;
      }

      if (account?.provider === "credentials") {
        return true;
      }

      return false;
    },
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
    jwt: async ({ token, user }) => {
      if (user) {
        // on sign in
        const userFromDb = await prisma.user.findUnique({
          where: {
            email: token.email ?? undefined,
          },
        });
        if (userFromDb) {
          token.userId = userFromDb.id;
        }

        token.email = user.email;
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;

      return session;
    },
  },
} satisfies NextAuthConfig;
