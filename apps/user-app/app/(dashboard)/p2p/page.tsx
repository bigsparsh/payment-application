"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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
import { PeerToPeerTransaction, User } from "@prisma/client";
import { Bank, TransactionStatus } from "@prisma/client";
import { getUserList } from "@/lib/actions/user";
import { createP2P, getP2P } from "@/lib/actions/p2p";
import { toast } from "sonner";
import { Ban, LoaderPinwheel, RotateCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
type ExtraUser = {
  from_user: User;
  to_user: User;
};
export default function Component() {
  const session = useSession();
  const [transactions, setTransactions] =
    useState<(PeerToPeerTransaction & ExtraUser)[]>();
  const [bank, setBank] = useState<Bank>();
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>();
  const [searchResults, setSearchResults] = useState<User[]>();
  const [selectedRecipient, setSelectedRecipient] = useState<User>();

  useEffect(() => {
    if (session.status === "loading") setLoading(true);
    else setLoading(false);
    if (session.status === "authenticated") gets();
  }, [session]);

  const gets = async () => {
    setLoading(true);
    setTransactions((await getP2P()).reverse());
    setSearchResults(await getUserList());
    setLoading(false);
  };

  var debouncer: ReturnType<typeof setTimeout>;
  const getSearchResults = async (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(debouncer);
    debouncer = setTimeout(async () => {
      setLoading(true);
      setSearchResults(await getUserList(e.target.value as string));
      setLoading(false);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRecipient || !bank || !amount) {
      toast("Invaild input", {
        description: "Please fill all the fields",
        icon: <Ban size="16" />,
      });
      return;
    }
    setLoading(true);
    try {
      const transaction: PeerToPeerTransaction & ExtraUser = await createP2P(
        session.data?.user?.email as string,
        selectedRecipient.email,
        amount,
        bank,
      );
      setTransactions([transaction, ...transactions!]);
    } catch (e: any) {
      toast("Transfer Failed", {
        description: e.message,
        icon: <Ban size="16" />,
      });
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1 py-8 px-6 md:px-8">
        <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold mb-4">Send Money</h1>
            <Card>
              <CardContent className="space-y-4 mt-7">
                <div>
                  <Label htmlFor="recipient">Recipient</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {selectedRecipient
                          ? selectedRecipient.email
                          : "Search for recipient"}
                        <ChevronDownIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <Input
                          type="email"
                          placeholder="Search by email"
                          className="w-full"
                          onChange={getSearchResults}
                        />
                        <div className="space-y-2">
                          {searchResults?.length != 0 ? (
                            searchResults?.map((user) => {
                              return (
                                <div
                                  className="flex items-center justify-between"
                                  key={user.user_id}
                                >
                                  <span className="font-medium">
                                    {user.email}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedRecipient(user)}
                                  >
                                    <PlusIcon className="w-4 h-4" />
                                  </Button>
                                </div>
                              );
                            })
                          ) : (
                            <div className="mt-4">No results found</div>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="0.00"
                    onChange={(e) => {
                      if (e.target.value.split(".").length > 2) {
                        e.target.value = e.target.value.slice(0, -1);
                      }
                      e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                      if (e.target.value.length > 5) {
                        if (e.target.value.includes("."))
                          e.target.value = e.target.value.slice(0, 8);
                        else e.target.value = e.target.value.slice(0, 5);
                      }
                      if (e.target.value.split(".")[1]?.length > 2) {
                        e.target.value = e.target.value.slice(0, -1);
                      }
                      setAmount(parseFloat(e.target.value));
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bank">Bank</Label>
                  <Select
                    onValueChange={(val) =>
                      setBank(
                        val === "AXIS"
                          ? Bank.AXIS
                          : val === "SBI"
                            ? Bank.SBI
                            : Bank.HDFC,
                      )
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Bank.HDFC}>HDFC Bank</SelectItem>
                      <SelectItem value={Bank.SBI}>
                        State Bank of India
                      </SelectItem>
                      <SelectItem value={Bank.AXIS}>Axis Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  {loading ? (
                    <Button disabled>
                      <LoaderPinwheel size={16} className="animate-spin" />
                    </Button>
                  ) : (
                    <Button>Send Payment</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
          <div>
            <h2 className="text-xl font-bold mb-4">Transfer Summary</h2>
            <Card>
              <CardContent className="space-y-4 mt-7">
                <div className="flex justify-between">
                  <span>Recipient:</span>
                  <span>{selectedRecipient?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>${amount ? amount : "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bank:</span>
                  <span>{bank ? bank : "Select a Bank"}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${amount ? amount : "0.00"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-8">
          <div className="text-xl font-bold mb-4 flex justify-between items-center">
            Previous Transfers
            {loading ? (
              <Button disabled>
                <RotateCw size={16} className="animate-spin" />
              </Button>
            ) : (
              <Button onClick={gets}>
                <RotateCw size={16} />
              </Button>
            )}
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Bank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions &&
                  transactions.map(
                    (transfer: PeerToPeerTransaction & ExtraUser) => (
                      <TableRow key={transfer.txn_id}>
                        <TableCell>
                          <Badge
                            variant={
                              transfer.txn_status === TransactionStatus.PENDING
                                ? "secondary"
                                : transfer.txn_status ===
                                  TransactionStatus.FAILED
                                  ? "destructive"
                                  : "default"
                            }
                          >
                            {transfer.txn_status}
                          </Badge>
                        </TableCell>
                        <TableCell>{transfer.to_user.name}</TableCell>
                        <TableCell>${transfer.amount}</TableCell>
                        <TableCell>{transfer.bank}</TableCell>
                      </TableRow>
                    ),
                  )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
}

function ChevronDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
