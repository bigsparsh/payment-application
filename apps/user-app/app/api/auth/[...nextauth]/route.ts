import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import db from "@repo/db/client";
import { AuthProvider } from "@repo/db/enums";
import { createUser } from "@/lib/actions/user";
import { redirect } from "next/navigation";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      name: "Google",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // @ts-ignore
      async authorize(credentials: { email: string; password: string }) {
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await db.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (existingUser) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            existingUser.password,
          );
          if (isPasswordValid) {
            return existingUser;
          }
          return null;
        }

        try {
          return await createUser({
            email: credentials.email,
            name: "Sparsh Singh",
            profile_image: "https://ui-avatars.com/api/?name=",
            password: hashedPassword,
            auth_provider: AuthProvider.CREDENTIALS,
          });
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signup",
    error: "/auth/signup",
  },
  callbacks: {
    // @ts-ignore
    async signIn({
      user,
      account,
    }: {
      user: {
        email: string;
        name: string;
        image: string;
      };
      account: { provider: "google" | "credentials" | "github" };
    }) {
      if (account.provider === "credentials") {
        return true;
      }
      const existingUser = await db.user.findFirst({
        where: {
          email: user.email,
          auth_type: AuthProvider.CREDENTIALS,
        },
      });
      if (existingUser) {
        console.log("User already exists\n\n\n");
        throw new Error(
          "An account with this email already exists, try signing with password instead",
        );
      }
      if (account.provider === "google") {
        try {
          await createUser({
            email: user.email,
            name: user.name,
            profile_image: user.image,
            password: "NaN",
            auth_provider: AuthProvider.GOOGLE,
          });
        } catch (e) {
          console.error(e);
        }
        return true;
      }
      return false;
    },
  },
});
export { handler as GET, handler as POST };
