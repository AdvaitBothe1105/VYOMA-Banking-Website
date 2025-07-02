/*
  Warnings:

  - A unique constraint covering the columns `[account_number]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "ifsc_code" TEXT NOT NULL DEFAULT 'VYOMAIN0000001';

-- CreateIndex
CREATE UNIQUE INDEX "Account_account_number_key" ON "Account"("account_number");
