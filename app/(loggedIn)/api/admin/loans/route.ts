import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthUser(req);
    if (!admin || !admin.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const status = req.nextUrl.searchParams.get("status");

    const loans = await prisma.loan.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ loans });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch admin loans" },
      { status: 500 }
    );
  }
}
