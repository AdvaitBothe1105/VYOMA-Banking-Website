/*
  Warnings:

  - A unique constraint covering the columns `[crn]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_crn_key" ON "Account"("crn");
