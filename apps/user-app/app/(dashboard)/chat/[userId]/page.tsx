"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { User } from "@repo/db/types";
import { getUserByEmail } from "@/lib/actions/user";

export default function Component() {
  const session = useSession();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");
    if (session.status === "authenticated") {
      gets();
      newSocket.onopen = () => {
        newSocket.send(
          JSON.stringify({
            id: user?.user_id,
            name: user?.name,
            email: user?.email,
          }),
        );
      };
      newSocket.onmessage = (message) => {
        console.log("Message received:", message.data);
      };
    }
    setSocket(newSocket);
    return () => newSocket.close();
  }, [session]);

  const gets = async () => {
    setUser(await getUserByEmail(session.data?.user?.email as string));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
          <div className="grid gap-4">
            <Card>
              <CardContent className="grid grid-cols-[1fr_auto] items-center gap-4 mt-5">
                <div>
                  <p className="font-medium">Jane Doe</p>
                  <p className="text-muted-foreground text-sm">May 15, 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$50.00</p>
                  <p className="text-muted-foreground text-sm">Sent</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="grid grid-cols-[1fr_auto] items-center gap-4">
                <div>
                  <p className="font-medium">Michael Smith</p>
                  <p className="text-muted-foreground text-sm">
                    April 30, 2023
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$25.00</p>
                  <p className="text-muted-foreground text-sm">Received</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="grid grid-cols-[1fr_auto] items-center gap-4">
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-muted-foreground text-sm">
                    April 20, 2023
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$75.00</p>
                  <p className="text-muted-foreground text-sm">Sent</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Chat</h2>
          <div className="bg-muted rounded-lg p-4 h-[400px] overflow-y-auto flex flex-col gap-4">
            <div className="flex items-end gap-2">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="bg-card text-card-foreground rounded-lg p-3 max-w-[70%]">
                <p>
                  Hi there, I just sent you a payment. Let me know if you have
                  any questions!
                </p>
                <p className="text-xs text-muted-foreground mt-1">3:45 PM</p>
              </div>
            </div>
            <div className="flex items-end gap-2 justify-end">
              <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[70%]">
                <p>
                  Thanks, I received the payment. I&apos;ll take a look at it.
                </p>
                <p className="text-xs text-primary-foreground/80 mt-1">
                  3:47 PM
                </p>
              </div>
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-end gap-2">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="bg-card text-card-foreground rounded-lg p-3 max-w-[70%]">
                <p>Great, let me know if you have any other questions!</p>
                <p className="text-xs text-muted-foreground mt-1">3:49 PM</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button>Send</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
