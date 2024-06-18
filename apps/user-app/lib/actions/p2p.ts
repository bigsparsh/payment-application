"use server";
import { Bank, TransactionStatus } from "@repo/db/enums";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import axios from "axios";
import jwt from "jsonwebtoken";

export const getP2P = async () => {
  const session = await getServerSession();
  if (!session?.user) throw new Error("User not found");
  return await db.peerToPeerTransaction.findMany({
    include: {
      from_user: true,
      to_user: true,
    },
    where: {
      from_user: {
        email: session.user.email as string,
      },
    },
  });
};

export const createP2P = async (
  from_user: string,
  to_user: string,
  amount: number,
  bank: Bank,
) => {
  if (amount <= 0) throw new Error("Invalid amount");
  if (!from_user || !to_user || !bank) throw new Error("Invalid input");
  const transaction = await db.peerToPeerTransaction.create({
    include: {
      from_user: true,
      to_user: true,
    },
    data: {
      amount,
      bank,
      from_user: {
        connect: {
          email: from_user,
        },
      },
      to_user: {
        connect: {
          email: to_user,
        },
      },
      txn_status: TransactionStatus.PENDING,
    },
  });
  await axios.post(
    "http://localhost:3001/resolve-p2p",
    {
      amount,
      bank,
      from_user: transaction.from_user,
      to_user: transaction.to_user,
    },
    {
      headers: {
        Authorization: `Bearer ${jwt.sign({ txn_id: `${transaction.txn_id}` }, process.env.USER_APP_SECRET as string)}`,
      },
    },
  );
  return transaction;
};
