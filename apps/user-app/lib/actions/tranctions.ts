"use server";

import { Bank, TransactionStatus } from "@prisma/client";
import db from "@repo/db/client";
import axios from "axios";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";

export const getTransactions = async () => {
  const session = await getServerSession();
  const userTransactions = (
    await db.onRampTransaction.findMany({
      where: {
        user: {
          email: session?.user?.email as string,
        },
      },
    })
  ).map((transaction) => {
    transaction.amount = transaction.amount / 100;
    return transaction;
  });
  return userTransactions;
};

export const createTransaction = async (amount: number, bank: Bank) => {
  const session = await getServerSession();
  const user = await db.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
    include: {
      balance: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  if (amount <= 0) {
    throw new Error("Amount cannot be negative or Zero");
  }

  const newTransaction = await db.onRampTransaction.create({
    data: {
      bank,
      user_id: user.user_id,
      amount: amount * 100,
      txn_status: TransactionStatus.PENDING,
    },
  });

  axios.post(
    "http://localhost:3001/resolve-on-ramp/",
    {
      amount: newTransaction.amount,
      bank: newTransaction.bank,
      user_id: newTransaction.user_id,
    },
    {
      headers: {
        Authorization: `Bearer ${jwt.sign({ txn_id: `${newTransaction.txn_id}` }, process.env.USER_APP_SECRET as string)}`,
      },
    },
  );
  newTransaction.amount = newTransaction.amount / 100;
  return newTransaction;
};
