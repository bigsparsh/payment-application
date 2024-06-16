"use server";

import { Bank } from "@prisma/client";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";

export const getTransactions = async () => {
  const session = await getServerSession();
  const userTransactions = await db.onRampTransaction.findMany({
    where: {
      user: {
        email: session?.user?.email as string,
      },
    },
  });
  return userTransactions;
};

export const createTransaction = async (amount: number, bank: Bank) => {
  return "heellomworld";
};
