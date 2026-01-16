import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { settleReputationAfterDecision } from "@/lib/reputationSettlement";

const INTEREST_RATE_RANGES: Record<string, { min: number; max: number }> = {
  A: { min: 8, max: 10 },
  B: { min: 11, max: 14 },
  C: { min: 15, max: 18 },
};

export async function POST(
  req: NextRequest,
  { params }: { params: { loanId: string } }
) {
  try {
    const admin = await getAuthUser(req);
    if (!admin || !admin.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { loanId } = await params;
    const { decision, interestRate } = await req.json();

    // Validate decision
    if (!["approved", "rejected"].includes(decision)) {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }

    // Fetch loan and verify status
    const loan = await prisma.loan.findUnique({
      where: { id: Number(loanId) },
    });

    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    if (loan.status !== "voting") {
      return NextResponse.json(
        { error: "Loan is not in voting status" },
        { status: 400 }
      );
    }

    // Process approval
    if (decision === "approved") {
      // Validate interest rate
      const riskBand = loan.riskBand;
      if (!riskBand || !INTEREST_RATE_RANGES[riskBand]) {
        return NextResponse.json(
          { error: "Invalid risk band for loan" },
          { status: 400 }
        );
      }

      if (typeof interestRate !== "number" || interestRate <= 0) {
        return NextResponse.json(
          { error: "Invalid interest rate" },
          { status: 400 }
        );
      }

      const range = INTEREST_RATE_RANGES[riskBand];
      if (interestRate < range.min || interestRate > range.max) {
        return NextResponse.json(
          {
            error: `Interest rate must be between ${range.min}% and ${range.max}% for Risk Band ${riskBand}`,
          },
          { status: 400 }
        );
      }

      // Approve loan
      await prisma.loan.update({
        where: { id: Number(loanId) },
        data: {
          status: "approved",
          interestRate: interestRate,
          approvedAt: new Date(),
        },
      });

      // STEP 6: Settle reputation after decision
      await settleReputationAfterDecision(Number(loanId), "approved");

      return NextResponse.json({
        success: true,
        message: "Loan approved successfully",
      });
    } else {
      // Reject loan
      await prisma.loan.update({
        where: { id: Number(loanId) },
        data: {
          status: "rejected",
          rejectedAt: new Date(),
        },
      });

      // STEP 6: Settle reputation after decision
      await settleReputationAfterDecision(Number(loanId), "rejected");

      return NextResponse.json({
        success: true,
        message: "Loan rejected successfully",
      });
    }
  } catch (err) {
    console.error("Loan decision error:", err);
    return NextResponse.json(
      { error: "Failed to process decision" },
      { status: 500 }
    );
  }
}
