import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "../auth";

export async function PATCH(req: NextRequest) {
  const adminCheck = await verifyAdmin(req);
  
  if (!adminCheck.isAdmin || adminCheck.error) {
    return adminCheck.error || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { crn, status } = await req.json();

    if (!crn || !status) {
      return NextResponse.json(
        { error: "CRN and status are required" },
        { status: 400 }
      );
    }

    if (!["pending", "verified", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: pending, verified, or rejected" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { crn },
      data: { kycStatus: status },
      select: {
        crn: true,
        name: true,
        email: true,
        kycStatus: true,
      },
    });

    return NextResponse.json({ user, message: `KYC status updated to ${status}` });
  } catch (error: any) {
    console.error("Error updating KYC status:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

