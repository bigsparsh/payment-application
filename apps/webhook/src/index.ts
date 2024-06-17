import express from "express";
import { authMiddleware } from "./middlewares/auth.js";
import { Bank, TransactionStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const app = express();
const PORT = 3002;

app.use(express.json());

// a request from the banking api will come
// in order to resolve the transaction
// the request will contain the amount, bank, txn_status, user_id, txn_id
// the request will also contain the jwt token for request verification
// we need to
// - edit the database to update the transaction txn_status
// - send a response to the banking api
// - edit the user balance in the database to reflect the transaction

app.post("/", authMiddleware, async (req, res) => {
  // getting the body
  const body: {
    amount: number;
    bank: Bank;
    txn_status: TransactionStatus;
    user_id: string;
    txn_id: string;
  } = await req.body;

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

  res.json({ message: "Transaction resolved" });
});

app.listen(PORT);
