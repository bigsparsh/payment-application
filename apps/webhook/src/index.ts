import express from "express";
import { authMiddleware } from "./middlewares/auth.js";
import { Bank, TransactionStatus, User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const app = express();
const PORT = 3002;
const rand = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

app.use(express.json());

app.post("/on-ramp", authMiddleware, async (req, res) => {
  // getting the body
  const body: {
    amount: number;
    bank: Bank;
    txn_status: TransactionStatus;
    user_id: string;
    txn_id: string;
  } = await req.body;

  // waiting for a random amount of time
  await new Promise((r) => setTimeout(r, rand(1000, 5000)));

  // updating the transaction status in the database
  await db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "user_id" = '${body.user_id}' FOR UPDATE`;
    await tx.onRampTransaction.update({
      where: { txn_id: body.txn_id },
      data: { txn_status: body.txn_status },
    });
    await tx.balance.update({
      where: { user_id: body.user_id },
      data: {
        amount: {
          increment:
            body.txn_status === TransactionStatus.SUCCESS ? body.amount : 0,
        },
      },
    });
  });

  res.json({ message: "On Ramp Transaction resolved" });
});

app.post("/p2p", authMiddleware, async (req, res) => {
  // getting the body
  const body: {
    amount: number;
    bank: Bank;
    txn_status: TransactionStatus;
    from_user: User;
    to_user: User;
    txn_id: string;
  } = await req.body;

  // waiting for a random amount of time
  await new Promise((r) => setTimeout(r, rand(1000, 5000)));

  // updating the transaction status in the database
  await db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "user_id" = '${body.from_user.user_id}' FOR UPDATE`;
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "user_id" = '${body.to_user.user_id}' FOR UPDATE`;
    await tx.peerToPeerTransaction.update({
      where: { txn_id: body.txn_id },
      data: { txn_status: body.txn_status },
    });
    await tx.balance.update({
      where: { user_id: body.from_user.user_id },
      data: {
        amount: {
          decrement:
            body.txn_status === TransactionStatus.SUCCESS ? body.amount : 0,
        },
      },
    });
    await tx.balance.update({
      where: { user_id: body.to_user.user_id },
      data: {
        amount: {
          increment:
            body.txn_status === TransactionStatus.SUCCESS ? body.amount : 0,
        },
      },
    });
  });

  res.json({ message: "Peer to Peer Transaction resolved" });
});

app.listen(PORT);
