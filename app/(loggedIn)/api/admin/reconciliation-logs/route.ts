import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "../auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Verify admin access
  const adminCheck = await verifyAdmin(req);

  if (!adminCheck.isAdmin || adminCheck.error) {
    return adminCheck.error || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const crn = req.nextUrl.searchParams.get("crn");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");

    if (!crn) {
      return NextResponse.json(
        { error: "CRN is required" },
        { status: 400 }
      );
    }

    const logs = await prisma.reconciliationLog.findMany({
      where: { crn },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      logs: logs.map((log: any) => ({
        id: log.id,
        action: log.action,
        chainVyo: log.chainVyo.toString(),
        dbBalance: log.dbBalance.toString(),
        ethBalance: log.ethBalance.toString(),
        performedBy: log.performedBy,
        createdAt: log.createdAt.toISOString(),
      }))
    });

  } catch (err: any) {
    console.error("Reconciliation logs error:", err);
    return NextResponse.json(
      { error: "Failed to fetch reconciliation logs", details: err.message },
      { status: 500 }
    );
  }
}