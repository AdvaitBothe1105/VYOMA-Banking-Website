import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "../../auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Verify admin access
  const adminCheck = await verifyAdmin(req);

  if (!adminCheck.isAdmin || adminCheck.error) {
    return adminCheck.error || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const crn = req.nextUrl.searchParams.get("crn");

    if (!crn) {
      return NextResponse.json(
        { error: "CRN is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { crn },
      select: {
        crn: true,
        name: true,
        onchainAddress: true,
        kycStatus: true,
        aadharUrl: true,
        panUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (err: any) {
    console.error("KYC user fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch user data", details: err.message },
      { status: 500 }
    );
  }
}