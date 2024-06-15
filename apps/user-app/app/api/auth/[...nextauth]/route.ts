import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import db from "@repo/db/client";
import { AuthProvider } from "@repo/db/enums";

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
          const newUser = await db.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              name: "Sparsh Singh",
              profile_image:
                "https://avatars.githubusercontent.com/u/47269261?v=4",
              auth_type: AuthProvider.CREDENTIALS,
            },
          });
          return newUser;
        } catch (e) {
          console.error(e);
        }

        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signup",
    error: "/transaction",
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
      if (account.provider === "google") {
        await db.user.upsert({
          where: {
            email: user.email,
          },
          update: {
            email: user.email,
            name: user.name,
            profile_image: user.image,
            auth_type: AuthProvider.GOOGLE,
          },
          create: {
            email: user.email,
            name: user.name,
            profile_image: user.image,
            password: "NaN",
            auth_type: AuthProvider.GOOGLE,
          },
        });
        return true;
      }
      return false;
    },
  },
});
export { handler as GET, handler as POST };
