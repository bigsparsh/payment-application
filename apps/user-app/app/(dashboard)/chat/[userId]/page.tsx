"use client";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import {
  Chat,
  PeerToPeerTransaction,
  TransactionStatus,
  User,
} from "@prisma/client";
import { getUserByEmail, getUserById } from "@/lib/actions/user";
import { createChat, getChat } from "@/lib/actions/chat";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  MessageCircleOff,
  RotateCw,
} from "lucide-react";
import { getP2PWith } from "@/lib/actions/p2p";
import { Skeleton } from "@/components/ui/skeleton";
import { type } from "os";

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
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [p2ps, setP2Ps] = useState<(PeerToPeerTransaction & ExtraUser)[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [onlineStatus, setOnlineStatus] = useState<boolean>(false);
  const chatbox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const newSocket = new WebSocket("ws://localhost:8080");
      newSocket.onopen = () => {
        newSocket.send(
          JSON.stringify({
            type: "connection",
            connectedTo: path.split("/")[2],
            payload: {
              id: user?.user_id,
              name: user?.name,
              email: user?.email,
            },
          }),
        );
        newSocket.send(
          JSON.stringify({
            type: "peer connection",
            connectedTo: path.split("/")[2],
          }),
        );
      };
      newSocket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.type === "message") {
          gets();
        }
        if (data.type === "peer connection") {
          data.connected ? setOnlineStatus(true) : setOnlineStatus(false);
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
    if (user) {
      window.onkeydown = (e) => {
        if (e.key === "Enter") {
          sendMessage();
        }
      };
    }
    if (session.status === "authenticated" && !user) {
      gets();
    }
    return () => {
      window.removeEventListener("keydown", () => { });
    };
  }, [session, user]);

  const sendMessage = async () => {
    const msg = messageRef.current?.value;
    if (msg === "") return;
    messageRef.current!.value = "";
    messageRef.current!.focus();
    if (msg && user) {
      const newChat = await createChat(
        msg as string,
        user.user_id as string,
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
    setOtherUser(await getUserById(path.split("/")[2]));
    setChats(await getChat(path.split("/")[2]));
    setP2Ps(await getP2PWith(path.split("/")[2]));
    setLoading(false);
  };

  const getOnlyP2Ps = async () => {
    setLoading(true);
    setP2Ps(await getP2PWith(path.split("/")[2]));
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        <section>
          <div className="text-2xl font-semibold mb-4 flex justify-between items-center">
            Payment History
            {loading ? (
              <Button disabled>
                <RotateCw size={16} className="animate-spin" />
              </Button>
            ) : (
              <Button onClick={getOnlyP2Ps}>
                <RotateCw size={16} />
              </Button>
            )}
          </div>
          <div className="grid gap-4">
            {p2ps?.length === 0 || !p2ps ? (
              <div className="flex gap-2 items-center justify-center h-96">
                <DollarSign size="45" />
                <div>
                  <div className="flex gap-2 items-center mb-[-25px]">
                    No transactions with{" "}
                    {loading ? (
                      <Skeleton className="w-32 h-4" />
                    ) : (
                      otherUser?.name
                    )}
                  </div>
                  <br />
                  Go to Peer to Peer to do so now!
                </div>
              </div>
            ) : (
              p2ps?.map((p2p) => {
                if (
                  p2p.txn_status === TransactionStatus.FAILED ||
                  p2p.txn_status === TransactionStatus.PENDING
                )
                  return;
                return (
                  <Card key={p2p.txn_id}>
                    <CardContent className="grid grid-cols-[1fr_auto] items-center gap-4 mt-5">
                      <div>
                        <p className="font-medium flex gap-x-5 flex-wrap">
                          {p2p.from_user.name}
                          {p2p.from_user_id == user?.user_id ? (
                            <ArrowRight />
                          ) : (
                            <ArrowLeft />
                          )}
                          {p2p.to_user.name}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {formatter.format(p2p.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$ {p2p.amount}</p>
                        <p className="text-muted-foreground text-sm">
                          {p2p.from_user_id == user?.user_id ? (
                            <p className="text-red-500">- Sent</p>
                          ) : (
                            <p className="text-lime-500">+ Received</p>
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            Chat with{" "}
            {loading ? <Skeleton className="w-32 h-8" /> : otherUser?.name}
          </h2>
          <div
            className="bg-muted rounded-lg p-4 h-[400px] overflow-y-auto flex flex-col gap-4"
            ref={chatbox}
          >
            {chats?.length === 0 || !chats ? (
              <div className=" flex justify-center items-center gap-4 h-full">
                <MessageCircleOff size="50" />
                No Chat history found <br />
                Start Messaging now!
              </div>
            ) : (
              chats?.map((chat) =>
                chat.from_user?.email === user?.email ? (
                  <>
                    <div className="flex items-end gap-2  flex-row-reverse ">
                      <Avatar>
                        <AvatarImage
                          src={chat.from_user?.profile_image as string}
                        />
                        <AvatarFallback className="bg-primary text-card">
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
                    <div className="flex items-end gap-2 ">
                      <Avatar
                        className={onlineStatus ? "ring-4 ring-lime-500" : ""}
                      >
                        <AvatarImage
                          src={chat.from_user?.profile_image as string}
                        />
                        <AvatarFallback
                          className={
                            "bg-card text-primary " +
                            (onlineStatus ? "border-2 border-lime-500" : "")
                          }
                        >
                          {chat.from_user?.name.split(" ")[0][0].toUpperCase()}
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
              )
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
