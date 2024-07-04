"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Component() {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080");
    newSocket.onopen = () => {
      console.log("Connection established");
      newSocket.send(JSON.stringify({ message: "Hello!" }));
    };
    newSocket.onmessage = (message) => {
      console.log("Message received:", message.data);
    };
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

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
                <p>Thanks, I received the payment. I'll take a look at it.</p>
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

function LogOutIcon(props) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
