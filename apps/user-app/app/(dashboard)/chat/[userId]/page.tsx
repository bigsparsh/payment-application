"use client";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Chat, User } from "@repo/db/types";
import { getUserByEmail } from "@/lib/actions/user";
import { createChat, getChat, getChatById } from "@/lib/actions/chat";
import { usePathname } from "next/navigation";

type ExtraUser = {
  from_user: User;
  to_user: User;
};
export default function Component() {
  const path = usePathname();
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const session = useSession();
  const messageRef = useRef<HTMLInputElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [chats, setChats] = useState<(Chat & ExtraUser)[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const chatbox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const newSocket = new WebSocket("ws://localhost:8080");
      newSocket.onopen = () => {
        newSocket.send(
          JSON.stringify({
            type: "connection",
            payload: {
              id: user?.user_id,
              name: user?.name,
              email: user?.email,
            },
          }),
        );
      };
      newSocket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.type === "message") {
          gets();
        }
      };
      setSocket(newSocket);
    }
    return () => socket?.close();
  }, [user, path]);

  useEffect(() => {
    (chatbox.current as HTMLDivElement).scrollTop = (
      chatbox.current as HTMLDivElement
    ).scrollHeight;
  }, [chats]);

  useEffect(() => {
    if (session.status === "authenticated") {
      gets();
    }
  }, [session]);

  const sendMessage = async () => {
    const msg = messageRef.current?.value;
    if (msg) {
      const newChat = await createChat(
        msg as string,
        user?.user_id as string,
        path.split("/")[2],
      );
      setChats((prev) => [
        // @ts-ignore
        ...prev,
        newChat,
      ]);
      socket?.send(
        JSON.stringify({
          type: "message",
          sender: user?.user_id,
          receiver: path.split("/")[2],
          payload: {
            id: newChat.chat_id,
            message: msg,
          },
        }),
      );
    }
  };

  const gets = async () => {
    setLoading(true);
    setUser(await getUserByEmail(session.data?.user?.email as string));
    setChats(await getChat(path.split("/")[2]));
    setLoading(false);
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
          <div
            className="bg-muted rounded-lg p-4 h-[400px] overflow-y-auto flex flex-col gap-4"
            ref={chatbox}
          >
            {chats?.length != 0 &&
              chats &&
              chats?.map((chat, index) =>
                chat.from_user?.email === user?.email ? (
                  <>
                    <div
                      className="flex items-end gap-2  flex-row-reverse "
                      id={index == chats.length - 1 ? "last" : ""}
                    >
                      <Avatar>
                        <AvatarImage
                          src={chat.from_user?.profile_image as string}
                        />
                        <AvatarFallback className="bg-card">
                          {chat.from_user.name?.split(" ")[0][0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[70%]">
                        <p>{chat.message}</p>
                        <p className="text-xs text-primary-foreground/80 mt-1">
                          {formatter.format(chat.sent_at)}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="flex items-end gap-2 "
                      id={index == chats.length - 1 ? "last" : ""}
                    >
                      <Avatar>
                        <AvatarImage
                          src={chat.to_user?.profile_image as string}
                        />
                        <AvatarFallback>
                          {chat.to_user?.name.split(" ")[0][0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-card text-card-foreground  rounded-lg p-3 max-w-[70%]">
                        <p>{chat.message}</p>
                        <p className="text-xs text-muted-foreground  mt-1">
                          {formatter.format(chat.sent_at)}
                        </p>
                      </div>
                    </div>
                  </>
                ),
              )}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              className="flex-1"
              ref={messageRef}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
