-- CreateTable
CREATE TABLE "PeerToPeerTransaction" (
    "txn_id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "bank" "Bank" NOT NULL,
    "amount" INTEGER NOT NULL,
    "txn_status" "TransactionStatus" NOT NULL,

    CONSTRAINT "PeerToPeerTransaction_pkey" PRIMARY KEY ("txn_id")
);

-- AddForeignKey
ALTER TABLE "PeerToPeerTransaction" ADD CONSTRAINT "PeerToPeerTransaction_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerToPeerTransaction" ADD CONSTRAINT "PeerToPeerTransaction_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
