"use server";

import { AuthType as AuthProvider } from "@prisma/client";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";

export const getUserByEmail = async (email: string) => {
  if (!email) throw new Error("Email is required");
  return await db.user.findUnique({
    where: {
      email,
    },
  });
};

export const getUserById = async (user_id: string) => {
  if (!user_id) throw new Error("User ID is required");
  return await db.user.findUnique({
    where: {
      user_id,
    },
  });
};

export const createUser = async (credentials: {
  email: string;
  name: string;
  profile_image?: string;
  password?: string;
  auth_provider: AuthProvider;
}) => {
  if (credentials.auth_provider === AuthProvider.CREDENTIALS) {
    const newUser = await db.user.create({
      data: {
        email: credentials.email,
        name: credentials.name,
        password: credentials.password as string,
        profile_image: credentials.profile_image,
        auth_type: credentials.auth_provider,
      },
    });
    try {
      await db.balance.create({
        data: {
          user_id: newUser.user_id,
          amount: 0,
          locked: 0,
        },
      });
    } catch (e) { }
    return newUser;
  }

  if (
    credentials.auth_provider === AuthProvider.GOOGLE ||
    credentials.auth_provider === AuthProvider.GITHUB
  ) {
    const newUser = await db.user.upsert({
      where: {
        email: credentials.email,
      },
      update: {
        email: credentials.email,
        name: credentials.name,
        profile_image: credentials.profile_image,
        auth_type: credentials.auth_provider,
      },
      create: {
        email: credentials.email,
        name: credentials.name,
        profile_image: credentials.profile_image,
        auth_type: credentials.auth_provider,
      },
    });
    try {
      await db.balance.create({
        data: {
          user_id: newUser.user_id,
          amount: 0,
          locked: 0,
        },
      });
    } catch (e) { }
    return newUser;
  }
};

export const getUserList = async (
  searchFilter: string = "",
  skip: number = 0,
  take: number = 5,
) => {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  return await db.user.findMany({
    skip,
    take,
    where: {
      email: {
        contains: searchFilter,
        not: {
          equals: session.user?.email as string,
        },
      },
    },
  });
};

export const getTransactionUsers = async () => {
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");
  return await db.peerToPeerTransaction.findMany({
    where: {
      from_user: {
        email: session.user?.email as string,
      },
    },
    include: {
      to_user: true,
    },
  });
};
