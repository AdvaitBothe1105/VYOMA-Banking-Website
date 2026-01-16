import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { getGovernanceContext } from "@/lib/governance";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1️⃣ User's own loans
    const myLoans = await prisma.loan.findMany({
      where: {
        borrowerCrn: user.crn,
      },
      include: {
        borrower: {
          include: {
            reputation: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 2️⃣ Loans open for voting (excluding user's own)
    const votableLoans = await prisma.loan.findMany({
      where: {
        status: "voting",
        borrowerCrn: {
          not: user.crn,
        },
      },
      include: {
        borrower: {
          include: {
            reputation: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Enhance votable loans with governance context and vote status
    const votableLoansEnhanced = await Promise.all(
      votableLoans.map(async (loan) => {
        const context = await getGovernanceContext(loan.id);
        
        // Check if user has already voted on this loan
        const existingVote = await prisma.loanVote.findUnique({
          where: {
            loanId_voterCrn: {
              loanId: loan.id,
              voterCrn: user.crn,
            },
          },
        });

        return {
          id: loan.id,
          amount: loan.amount,
          tenureMonths: loan.tenureMonths,
          purpose: loan.purpose,
          purposeCategory: loan.purposeCategory,
          status: loan.status,
          interestRate: loan.interestRate,
          riskBand: loan.riskBand,
          borrowerReliability: context?.borrowerReliability,
          loanHistory: context?.loanHistory,
          createdAt: loan.createdAt,
          voted: !!existingVote,
          userVote: existingVote?.vote ?? null,
        };
      })
    );

    // Format my loans to match the expected interface
    const myLoansFormatted = myLoans.map((loan) => ({
      id: loan.id,
      amount: loan.amount,
      tenureMonths: loan.tenureMonths,
      purpose: loan.purpose,
      purposeCategory: loan.purposeCategory,
      status: loan.status,
      interestRate: loan.interestRate,
      riskBand: loan.riskBand,
      createdAt: loan.createdAt,
    }));

    return NextResponse.json({
      myLoans: myLoansFormatted,
      votableLoans: votableLoansEnhanced,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch loans" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, tenureMonths, purposeCategory, purpose } = body;

    // Validate inputs
    if (!amount || !tenureMonths || !purpose) {
      return NextResponse.json(
        { error: "Missing required fields: amount, tenureMonths, purpose" },
        { status: 400 }
      );
    }

    if (amount <= 0 || tenureMonths <= 0) {
      return NextResponse.json(
        { error: "Amount and tenure must be positive" },
        { status: 400 }
      );
    }

    // Create new loan application
    const loan = await prisma.loan.create({
      data: {
        borrowerCrn: user.crn,
        amount: parseFloat(String(amount)),
        tenureMonths: parseInt(String(tenureMonths), 10),
        purposeCategory: purposeCategory || "personal",
        purpose: String(purpose),
        status: "pending",
        interestRate: 0, // Will be calculated after approval
        riskBand: "", // Will be assessed by admin
      },
    });

    return NextResponse.json({ success: true, loan }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to apply for loan" },
      { status: 500 }
    );
  }
}
