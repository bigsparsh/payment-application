-- CreateTable
CREATE TABLE "Chat" (
    "chat_id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("chat_id")
);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
