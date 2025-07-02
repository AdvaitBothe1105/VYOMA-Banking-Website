import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const crn = new URL(req.url).searchParams.get("crn");
  if (!crn) return NextResponse.json({ error: "CRN required" }, { status: 400 });

  const account = await prisma.account.findUnique({ where: { crn } });
  if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { fromAccountId: account.account_id },
        { toAccountId: account.account_id },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      fromAccount: true,
      toAccount: true,
    },
  });

  return NextResponse.json({ transactions });
}