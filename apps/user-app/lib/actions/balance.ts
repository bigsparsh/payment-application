"use server";
import { getServerSession } from "next-auth";
import db from "@repo/db/client";
import { Balance } from "@prisma/client";

export const getBalance = async () => {
  const session = await getServerSession();

  const balance: Balance | null = await db.balance.findFirst({
    where: {
      user: {
        email: session?.user?.email as string,
      },
    },
  });

  if (balance?.amount) {
    balance.amount = balance.amount / 100;
  }
  if (!balance) {
    throw new Error("User not found");
  }

  return balance;
};
