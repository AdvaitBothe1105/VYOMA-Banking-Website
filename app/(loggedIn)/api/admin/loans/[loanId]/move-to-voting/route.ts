import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { calculateRiskBand } from "@/lib/risk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { loanId: string } }
) {
  const admin = await getAuthUser(req);
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const loan = await prisma.loan.findUnique({
    where: { id: Number(params.loanId) },
  });

  if (!loan || loan.status !== "pending") {
    return NextResponse.json({ error: "Invalid loan state" }, { status: 400 });
  }

  const reputation = await prisma.reputation.findUnique({
    where: { crn: loan.borrowerCrn },
  });

  if (!reputation) {
    return NextResponse.json(
      { error: "Borrower reputation not found" },
      { status: 400 }
    );
  }

  // 🔹 PRELIMINARY RISK ASSESSMENT
  const riskBand = calculateRiskBand({
    amount: Number(loan.amount),
    tenureMonths: loan.tenureMonths,
    reputationScore: reputation.score,
  });

  const updatedLoan = await prisma.loan.update({
    where: { id: loan.id },
    data: {
      status: "voting",
      riskBand, // ← assigned here
    },
  });

  return NextResponse.json({ success: true, loan: updatedLoan });
}
