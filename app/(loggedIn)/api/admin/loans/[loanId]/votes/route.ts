import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { aggregateVotes } from "@/lib/voteAggregation";

export async function GET(
  req: NextRequest,
  { params }: { params: { loanId: string } }
) {
  const admin = await getAuthUser(req);
  if (!admin || !admin.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { loanId } = await params;
  const result = await aggregateVotes(Number(loanId));

  return NextResponse.json(result);
}
