import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import db from "@repo/db/client";

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
              auth_type: "credentials",
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
    error: "/",
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
      };
      account: { provider: "google" | "github" | "credentials" };
    }) {
      if (account.provider === "credentials") {
        return true;
      }
      if (account.provider === "google") {
      }
      return false;
    },
  },
});
export { handler as GET, handler as POST };
