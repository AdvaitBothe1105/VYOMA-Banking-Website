import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { loanId: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { vote } = await req.json();

    // STEP 3: Only accept "yes" or "no"
    if (!["yes", "no"].includes(vote)) {
      return NextResponse.json(
        { error: "Invalid vote. Must be 'yes' or 'no'." },
        { status: 400 }
      );
    }

    const loanId = Number(params.loanId);

    // Verify loan exists and is in voting status
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
    });

    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    if (loan.status !== "voting") {
      return NextResponse.json(
        { error: "Voting is not allowed on this loan" },
        { status: 400 }
      );
    }

    // Prevent self-voting
    if (loan.borrowerCrn === user.crn) {
      return NextResponse.json(
        {
          error: "You cannot vote on your own loan application",
        },
        { status: 403 }
      );
    }

    // Record the vote
    // Unique constraint will prevent duplicate votes
    await prisma.loanVote.create({
      data: {
        loanId,
        voterCrn: user.crn,
        vote, // "yes" | "no"
        weight: 1, // Fixed in STEP 3, will be used in future phases
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your vote has been recorded",
    });
  } catch (err: any) {
    // Prisma unique constraint error => already voted
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "You have already voted on this loan" },
        { status: 409 }
      );
    }

    console.error("Vote submission error:", err);
    return NextResponse.json(
      { error: "Failed to submit vote" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { loanId: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ voted: false, vote: null });
    }

    const loanId = Number(params.loanId);

    const existingVote = await prisma.loanVote.findUnique({
      where: {
        loanId_voterCrn: {
          loanId,
          voterCrn: user.crn,
        },
      },
    });

    return NextResponse.json({
      voted: !!existingVote,
      vote: existingVote?.vote ?? null,
    });
  } catch (err) {
    console.error("Vote status check error:", err);
    return NextResponse.json({ voted: false, vote: null });
  }
}
