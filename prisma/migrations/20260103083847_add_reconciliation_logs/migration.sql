-- CreateTable
CREATE TABLE "ReconciliationLog" (
    "id" SERIAL NOT NULL,
    "crn" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "chainVyo" DECIMAL(65,30) NOT NULL,
    "dbBalance" DECIMAL(65,30) NOT NULL,
    "ethBalance" DECIMAL(65,30) NOT NULL,
    "performedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReconciliationLog_pkey" PRIMARY KEY ("id")
);
