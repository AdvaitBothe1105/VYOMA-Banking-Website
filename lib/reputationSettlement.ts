import { prisma } from "@/lib/prisma";
import { adjustReputation } from "@/lib/reputation";

/**
 * Settle reputation updates after a loan decision
 * This is the outcome-based feedback that closes the governance loop
 *
 * Borrower reputation:
 * - Approved: +10 (positive trust signal)
 * - Rejected: -5 (weak signal, not punitive)
 *
 * Voter reputation (based on vote correctness):
 * - yes → approved: +2 (correct)
 * - no → rejected: +2 (correct)
 * - yes → rejected: -1 (incorrect)
 * - no → approved: -1 (incorrect)
 */
export async function settleReputationAfterDecision(
  loanId: number,
  finalStatus: "approved" | "rejected"
) {
  try {
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        votes: true,
      },
    });

    if (!loan) {
      console.warn(`[REPUTATION] Loan ${loanId} not found, skipping settlement`);
      return;
    }

    // 1️⃣ Update borrower reputation based on loan outcome
    if (finalStatus === "approved") {
      await adjustReputation(
        loan.borrowerCrn,
        10,
        `Loan approved (₹${loan.amount} for ${loan.tenureMonths}mo)`
      );
    } else {
      await adjustReputation(
        loan.borrowerCrn,
        -5,
        "Loan rejected after review"
      );
    }

    // 2️⃣ Update voter reputation based on vote correctness
    for (const vote of loan.votes) {
      let delta = 0;
      let reason = "";

      if (vote.vote === "yes" && finalStatus === "approved") {
        delta = 2;
        reason = "Correct vote (yes → approved)";
      } else if (vote.vote === "no" && finalStatus === "rejected") {
        delta = 2;
        reason = "Correct vote (no → rejected)";
      } else if (vote.vote === "yes" && finalStatus === "rejected") {
        delta = -1;
        reason = "Incorrect vote (yes → rejected)";
      } else if (vote.vote === "no" && finalStatus === "approved") {
        delta = -1;
        reason = "Incorrect vote (no → approved)";
      }

      if (delta !== 0) {
        await adjustReputation(vote.voterCrn, delta, reason);
      }
    }

    console.log(
      `[REPUTATION SETTLEMENT] Completed for loan ${loanId} (${finalStatus})`
    );
  } catch (err) {
    console.error(
      `[REPUTATION SETTLEMENT ERROR] Failed to settle reputation for loan ${loanId}:`,
      err
    );
    throw err;
  }
}
