"use client";

import { useState } from "react";
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

export default function Component() {
  const [transfers, setTransfers] = useState([
    {
      id: 1,
      recipient: "John Doe",
      amount: 50.0,
      bank: "Chase",
      date: "2023-05-15",
    },
    {
      id: 2,
      recipient: "Jane Smith",
      amount: 75.0,
      bank: "Wells Fargo",
      date: "2023-04-20",
    },
    {
      id: 3,
      recipient: "Bob Johnson",
      amount: 25.0,
      bank: "Bank of America",
      date: "2023-03-10",
    },
  ]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  return (
    <div className="flex flex-col">
      <main className="flex-1 py-8 px-6 md:px-8">
        <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
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
                        />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">John Doe</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setSelectedRecipient({
                                  email: "john@example.com",
                                })
                              }
                            >
                              <PlusIcon className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Jane Smith</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setSelectedRecipient({
                                  email: "jane@example.com",
                                })
                              }
                            >
                              <PlusIcon className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Bob Johnson</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setSelectedRecipient({
                                  email: "bob@example.com",
                                })
                              }
                            >
                              <PlusIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="bank">Bank</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chase">Chase</SelectItem>
                      <SelectItem value="wells-fargo">Wells Fargo</SelectItem>
                      <SelectItem value="bank-of-america">
                        Bank of America
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button>Send Payment</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Transfer Summary</h2>
            <Card>
              <CardContent className="space-y-4 mt-7">
                <div className="flex justify-between">
                  <span>Recipient:</span>
                  <span>{selectedRecipient?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>$50.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Bank:</span>
                  <span>Chase</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>$50.00</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="max-w-2xl mx-auto mt-8">
          <h2 className="text-xl font-bold mb-4">Previous Transfers</h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Bank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>{transfer.date}</TableCell>
                    <TableCell>{transfer.recipient}</TableCell>
                    <TableCell>${transfer.amount.toFixed(2)}</TableCell>
                    <TableCell>{transfer.bank}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
}

function ChevronDownIcon(props) {
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

function PlusIcon(props) {
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
