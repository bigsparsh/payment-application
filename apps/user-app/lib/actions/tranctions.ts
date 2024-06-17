"use server";

import { Bank, TransactionStatus } from "@repo/db/enums";
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
  const session = await getServerSession();
  const user = await db.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const [newTransaction, _] = await db.$transaction([
    db.onRampTransaction.create({
      data: {
        bank,
        user_id: user.user_id,
        amount,
        txn_status: TransactionStatus.PENDING,
      },
    }),
    db.balance.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        amount: {
          increment: amount * 100,
        },
      },
    }),
  ]);
  return newTransaction;
};
