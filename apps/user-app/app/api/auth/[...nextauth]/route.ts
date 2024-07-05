import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";
import db from "@repo/db/client";
import { AuthType as AuthProvider } from "@prisma/client";
import { createUser } from "@/lib/actions/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      name: "Google",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    GithubProvider({
      name: "Github",
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
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
            existingUser.password as string,
          );
          if (isPasswordValid) {
            return existingUser;
          }
          return null;
        }

        try {
          return await createUser({
            email: credentials.email,
            name: credentials.email.split("@")[0],
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
      console.log(JSON.stringify(account) + "\n\n\n");
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
        throw new Error(
          "An account with this email already exists, try signing with password instead",
        );
      }
      if (account.provider === "google") {
        const githubUser = await db.user.findFirst({
          where: {
            email: user.email,
            auth_type: AuthProvider.GITHUB,
          },
        });
        if (githubUser) {
          throw new Error(
            "An account with this email already exists in github, try signing with github instead",
          );
        }
        try {
          await createUser({
            email: user.email,
            name: user.name,
            profile_image: user.image,
            auth_provider: AuthProvider.GOOGLE,
          });
        } catch (e) {
          console.error(e);
        }
        return true;
      }
      if (account.provider === "github") {
        const googleUser = await db.user.findFirst({
          where: {
            email: user.email,
            auth_type: AuthProvider.GOOGLE,
          },
        });
        if (googleUser) {
          throw new Error(
            "An account with this email already exists in google, try signing with google instead",
          );
        }
        try {
          await createUser({
            email: user.email,
            name: user.name,
            profile_image: user.image,
            auth_provider: AuthProvider.GITHUB,
          });
          return true;
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
