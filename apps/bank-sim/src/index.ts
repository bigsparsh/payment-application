import { Bank, TransactionStatus } from "@prisma/client";
import jwt from "jsonwebtoken";
import express from "express";
import axios from "axios";
import { authMiddleware } from "./middleware/auth.js";
import "dotenv/config";
const app = express();
const PORT = 3001;

const rand = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

app.use(express.json());

app.post("/resolve-on-ramp", authMiddleware, async (req, res) => {
  // getting the body
  const body: {
    amount: number;
    bank: Bank;
    user_id: string;
  } = await req.body;

  //getinng the txn id from the jwt
  const { txn_id } = jwt.decode(
    req.headers.authorization?.split(" ")[1] as string,
  ) as { txn_id: string };

  // waiting for a random amount of time
  await new Promise((r) => setTimeout(r, rand(1000, 5000)));

  // sending the response to the webhook
  await axios.post(
    process.env.WEBHOOK_URL as string,
    {
      amount: body.amount,
      bank: body.bank,
      txn_status:
        rand(0, 1) === 1 ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
      user_id: body.user_id,
      txn_id,
    },
    {
      headers: {
        Authorization: `Bearer ${jwt.sign({ txn_token: `${body.user_id}${new Date()}` }, process.env.WEBHOOK_SECRET as string)}`,
      },
    },
  );

  // sending the response to the user-app
  return res.json({ message: "Payment captured" });
});

app.listen(PORT);
