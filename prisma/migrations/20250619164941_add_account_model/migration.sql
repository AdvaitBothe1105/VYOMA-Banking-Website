-- CreateTable
CREATE TABLE "Account" (
    "account_id" SERIAL NOT NULL,
    "crn" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 3000.00,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("account_id")
);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_crn_fkey" FOREIGN KEY ("crn") REFERENCES "User"("crn") ON DELETE CASCADE ON UPDATE CASCADE;
