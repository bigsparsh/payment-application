"use server";

import { AuthProvider } from "@repo/db/enums";
import db from "@repo/db/client";

export const getUser = async (email: string) => {
  if (!email) throw new Error("Email is required");
  return await db.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (credentials: {
  email: string;
  name: string;
  profile_image: string;
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
    await db.balance.create({
      data: {
        user_id: newUser.user_id,
        amount: 0,
        locked: 0,
      },
    });
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
    await db.balance.create({
      data: {
        user_id: newUser.user_id,
        amount: 0,
        locked: 0,
      },
    });
    return newUser;
  }
};
