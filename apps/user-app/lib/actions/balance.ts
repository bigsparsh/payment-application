"use server";
import { getServerSession } from "next-auth";
import db from "@repo/db/client";

export const getBalance = async () => {
  const session = await getServerSession();

  const balance = await db.balance.findFirst({
    where: {
      user: {
        email: session?.user?.email as string,
      },
    },
  });
  if (!balance) {
    throw new Error("User not found");
  }

  return balance;
};
