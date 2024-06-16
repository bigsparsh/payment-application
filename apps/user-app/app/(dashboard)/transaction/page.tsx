"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createTransaction, getTransactions } from "@/lib/actions/tranctions";
import { useEffect, useRef, useState } from "react";
import { Balance, OnRampTransaction } from "@repo/db/types";
import { getBalance } from "@/lib/actions/balance";
import { Bank } from "@repo/db/enums";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function Component() {
  const session = useSession();
  const [balance, setBalance] = useState<Balance>();
  const [bank, setBank] = useState<string>();
  const amount = useRef<HTMLInputElement>(null);
  const [tranctions, setTransactions] = useState<OnRampTransaction[]>([]);
  useEffect(() => {
    gets();
  }, [session]);
  const gets = async () => {
    if (session.status === "loading" || session.status === "unauthenticated")
      return;
    setTransactions(await getTransactions());
    setBalance(await getBalance());
    return;
  };
  const handleSubmit = async () => {
    if (!amount.current?.value || !bank) {
      toast("Please fill all the fields");
      return;
    }
    const newTransaction = await createTransaction(
      Number(amount.current?.value),
      bank as Bank,
    );
    setTransactions([...tranctions, newTransaction]);
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="grid gap-4 mt-7">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" placeholder="Enter amount" ref={amount} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank">Bank</Label>
              <Select
                onValueChange={(bnk) => {
                  setBank(bnk);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Bank.HDFC}>HDFC Bank</SelectItem>
                  <SelectItem value={Bank.SBI}>State Bank of India</SelectItem>
                  <SelectItem value={Bank.AXIS}>Axis Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleSubmit}>
              Add Funds
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-4 mt-7">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Unlocked Balance</span>
                <span className="text-lg font-bold">${balance?.amount}</span>
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                Available for immediate use
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Locked Balance</span>
                <span className="text-lg font-bold">${balance?.locked}</span>
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                Pending transactions
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Balance</span>
                <span className="text-lg font-bold">
                  ${balance?.amount! + balance?.locked!}
                </span>
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                All available funds
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tranctions && tranctions.length != 0 ? (
                tranctions?.map((ele) => {
                  return (
                    <TableRow key={ele.txn_id}>
                      <TableCell>{ele.txn_id}</TableCell>
                      <TableCell>{ele.bank}</TableCell>
                      <TableCell>${ele.amount}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{ele.txn_status}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell className="h-40 w-full grid place-items-center text-red-500 font-bold">
                    No On Ramp Transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
