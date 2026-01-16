import { prisma } from "@/lib/prisma";

export async function canUserVoteOnLoan(
  voterCrn: string,
  loanId: number
): Promise<{ eligible: boolean; reason?: string }> {

  const user = await prisma.user.findUnique({
    where: { crn: voterCrn },
    include: {
      reputation: true,
    },
  });

  if (!user) {
    return { eligible: false, reason: "User not found" };
  }

  if (user.isAdmin) {
    return { eligible: false, reason: "Admins cannot vote" };
  }

  if (user.kycStatus !== "verified") {
    return { eligible: false, reason: "KYC not verified" };
  }

  if (!user.reputation || user.reputation.score < 300) {
    return { eligible: false, reason: "Insufficient reputation" };
  }

  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
    select: { borrowerCrn: true },
  });

  if (!loan) {
    return { eligible: false, reason: "Loan not found" };
  }

  if (loan.borrowerCrn === voterCrn) {
    return { eligible: false, reason: "Borrower cannot vote on own loan" };
  }

  const priorVote = await prisma.loanVote.findUnique({
    where: {
      loanId_voterCrn: {
        loanId,
        voterCrn,
      },
    },
  });

  if (priorVote) {
    return { eligible: false, reason: "Already voted" };
  }

  const txCount = await prisma.transaction.count({
    where: {
      OR: [
        { fromAccount: { crn: voterCrn } },
        { toAccount: { crn: voterCrn } },
      ],
    },
  });

  if (txCount === 0) {
    return { eligible: false, reason: "No transaction history" };
  }

  return { eligible: true };
}
