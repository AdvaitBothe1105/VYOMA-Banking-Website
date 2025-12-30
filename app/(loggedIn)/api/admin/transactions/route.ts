import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "../auth";

export async function GET(req: NextRequest) {
  const adminCheck = await verifyAdmin(req);
  
  if (!adminCheck.isAdmin || adminCheck.error) {
    return adminCheck.error || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = parseInt(searchParams.get("skip") || "0");

    const transactions = await prisma.transaction.findMany({
      include: {
        fromAccount: {
          select: {
            account_number: true,
            name: true,
            crn: true,
          },
        },
        toAccount: {
          select: {
            account_number: true,
            name: true,
            crn: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 500), // Max 500
      skip,
    });

    const total = await prisma.transaction.count();

    return NextResponse.json({ transactions, total });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

