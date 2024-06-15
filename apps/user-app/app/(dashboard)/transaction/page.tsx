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

export default function Component() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="grid gap-4 mt-7">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" placeholder="Enter amount" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank">Bank</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank1">Bank 1</SelectItem>
                  <SelectItem value="bank2">Bank 2</SelectItem>
                  <SelectItem value="bank3">Bank 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">Send Payment</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-4 mt-7">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Unlocked Balance</span>
                <span className="text-lg font-bold">$5,000</span>
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                Available for immediate use
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Locked Balance</span>
                <span className="text-lg font-bold">$2,500</span>
              </div>
              <div className="text-sm text-stone-500 dark:text-stone-400">
                Pending transactions
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Balance</span>
                <span className="text-lg font-bold">$7,500</span>
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
                <TableHead>Amount</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>$500</TableCell>
                <TableCell>Bank 1</TableCell>
                <TableCell>June 15, 2024</TableCell>
                <TableCell>
                  <Badge>Completed</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>$250</TableCell>
                <TableCell>Bank 2</TableCell>
                <TableCell>June 10, 2024</TableCell>
                <TableCell>
                  <Badge>Completed</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>$1,000</TableCell>
                <TableCell>Bank 3</TableCell>
                <TableCell>June 5, 2024</TableCell>
                <TableCell>
                  <Badge variant="destructive">Pending</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>$750</TableCell>
                <TableCell>Bank 1</TableCell>
                <TableCell>June 1, 2024</TableCell>
                <TableCell>
                  <Badge>Completed</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>$300</TableCell>
                <TableCell>Bank 2</TableCell>
                <TableCell>May 28, 2024</TableCell>
                <TableCell>
                  <Badge>Completed</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
