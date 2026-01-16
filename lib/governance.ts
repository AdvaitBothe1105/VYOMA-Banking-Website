import { prisma } from "@/lib/prisma";

/**
 * Bucket reputation scores into human-readable reliability levels
 * This mirrors real credit committee practices
 */
export function getBorrowerReliability(reputationScore: number): "Low" | "Medium" | "High" {
  if (reputationScore >= 600) return "High";
  if (reputationScore >= 300) return "Medium";
  return "Low";
}

/**
 * Get human-readable purpose category label
 */
export function getPurposeCategoryLabel(
  category: string
): string {
  const labels: Record<string, string> = {
    education: "Education",
    medical: "Medical/Health",
    business: "Business",
    personal: "Personal",
    other: "Other",
  };
  return labels[category] || "Other";
}

/**
 * Determine borrower's loan history within Vyoma
 * Returns human-readable history status
 */
export async function getLoanHistory(
  borrowerCrn: string
): Promise<{
  status: "No History" | "Past Approved Loans" | "Active Loans";
  count: number;
}> {
  const loans = await prisma.loan.findMany({
    where: {
      borrowerCrn,
      status: {
        in: ["approved", "voting"],
      },
    },
  });

  if (loans.length === 0) {
    return { status: "No History", count: 0 };
  }

  const activeLoans = loans.filter((l) => l.status === "voting");

  if (activeLoans.length > 0) {
    return { status: "Active Loans", count: activeLoans.length };
  }

  return {
    status: "Past Approved Loans",
    count: loans.length,
  };
}


/**
 * Aggregate governance context for voting
 * This is what voters see when making decisions
 */
export async function getGovernanceContext(loanId: number) {
  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
    include: {
      borrower: {
        include: {
          reputation: true,
        },
      },
    },
  });

  if (!loan) {
    return null;
  }

  const reputation = loan.borrower.reputation;
  const loanHistory = await getLoanHistory(loan.borrowerCrn);

  return {
    // Financial Exposure
    amount: Number(loan.amount),
    tenureMonths: loan.tenureMonths,

    // Context
    purposeCategory: getPurposeCategoryLabel(loan.purposeCategory),
    purpose: loan.purpose,

    // Administrative Assessment
    riskBand: loan.riskBand,

    // Borrower Reliability
    borrowerReliability: getBorrowerReliability(reputation?.score || 300),
    loanHistory: loanHistory.status,

    // Metadata
    appliedDate: loan.createdAt.toLocaleDateString(),
  };
}

/**
 * Format governance context for display in voting interface
 */
export function formatGovernanceContext(context: Awaited<ReturnType<typeof getGovernanceContext>>) {
  if (!context) return null;

  return {
    financialExposure: {
      amount: `₹${context.amount.toLocaleString()}`,
      tenure: `${context.tenureMonths} months`,
    },
    borrowerProfile: {
      reliability: context.borrowerReliability,
      history: context.loanHistory,
    },
    context: {
      purpose: context.purposeCategory,
      description: context.purpose,
    },
    assessment: {
      riskBand: context.riskBand,
    },
    meta: {
      appliedDate: context.appliedDate,
    },
  };
}
