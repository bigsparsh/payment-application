-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('GOOGLE', 'CREDENTIALS', 'GITHUB');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "Bank" AS ENUM ('AXIS', 'HDFC', 'SBI');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_image" TEXT NOT NULL,
    "auth_type" "AuthType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "OnRampTransaction" (
    "txn_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "bank" "Bank" NOT NULL,
    "amount" INTEGER NOT NULL,
    "txn_status" "TransactionStatus" NOT NULL,

    CONSTRAINT "OnRampTransaction_pkey" PRIMARY KEY ("txn_id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "balance_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "locked" INTEGER NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("balance_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OnRampTransaction_user_id_key" ON "OnRampTransaction"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Balance_user_id_key" ON "Balance"("user_id");

-- AddForeignKey
ALTER TABLE "OnRampTransaction" ADD CONSTRAINT "OnRampTransaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
