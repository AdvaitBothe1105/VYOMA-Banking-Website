import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canUserVoteOnLoan } from "@/lib/loanVoting";
import { getAuthUser } from "@/lib/auth"; // your existing JWT helper

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loans = await prisma.loan.findMany({
      where: {
        status: "voting",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const votableLoans = [];

    for (const loan of loans) {
      const eligibility = await canUserVoteOnLoan(user.crn, loan.id);

      if (!eligibility.eligible) continue;

      votableLoans.push({
        loanId: loan.id,
        amount: loan.amount,
        tenureMonths: loan.tenureMonths,
        purpose: loan.purpose,
        riskBand: loan.riskBand,
        interestRate: loan.interestRate,
        createdAt: loan.createdAt,
      });
    }

    return NextResponse.json({ loans: votableLoans });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch votable loans" },
      { status: 500 }
    );
  }
}
