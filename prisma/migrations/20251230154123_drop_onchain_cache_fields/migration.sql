/*
  Warnings:

  - You are about to drop the column `onchainBalance` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `walletStatus` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "onchainBalance",
DROP COLUMN "walletStatus";
