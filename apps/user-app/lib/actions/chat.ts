"use server";
import { getServerSession } from "next-auth";
import db from "@repo/db/client";
import { Chat, User } from "@prisma/client";

type ExtraUser = {
  to_user: User;
  from_user: User;
};
export const getChat = async () => {
  const session = await getServerSession();

  const chat: (Chat & ExtraUser)[] = await db.chat.findMany({
    where: {
      OR: [
        {
          from_user: {
            email: session?.user?.email as string,
          },
        },
        {
          to_user: {
            email: session?.user?.email as string,
          },
        },
      ],
    },
    orderBy: {
      sent_at: "desc",
    },
    include: {
      to_user: true,
      from_user: true,
    },
  });

  if (!chat) {
    throw new Error("User not found");
  }

  return chat;
};

export const createChat = async (
  message: string,
  from_user_id: string,
  to_user_id: string,
) => {
  const chat = await db.chat.create({
    data: {
      message,
      from_user_id,
      to_user_id,
    },
    include: {
      to_user: true,
      from_user: true,
    },
  });

  return chat;
};
