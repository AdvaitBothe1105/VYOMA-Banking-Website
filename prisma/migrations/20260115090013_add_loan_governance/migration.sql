-- CreateTable
CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "borrowerCrn" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "tenureMonths" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "interestRate" DECIMAL(65,30) NOT NULL,
    "riskBand" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanVote" (
    "id" SERIAL NOT NULL,
    "loanId" INTEGER NOT NULL,
    "voterCrn" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoanVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reputation" (
    "crn" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 300,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reputation_pkey" PRIMARY KEY ("crn")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoanVote_loanId_voterCrn_key" ON "LoanVote"("loanId", "voterCrn");

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_borrowerCrn_fkey" FOREIGN KEY ("borrowerCrn") REFERENCES "User"("crn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanVote" ADD CONSTRAINT "LoanVote_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanVote" ADD CONSTRAINT "LoanVote_voterCrn_fkey" FOREIGN KEY ("voterCrn") REFERENCES "User"("crn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reputation" ADD CONSTRAINT "Reputation_crn_fkey" FOREIGN KEY ("crn") REFERENCES "User"("crn") ON DELETE RESTRICT ON UPDATE CASCADE;
