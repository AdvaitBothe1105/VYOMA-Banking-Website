import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "../auth";

export async function GET(req: NextRequest) {
  const adminCheck = await verifyAdmin(req);
  
  if (!adminCheck.isAdmin || adminCheck.error) {
    return adminCheck.error || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        crn: true,
        name: true,
        email: true,
        phone: true,
        accountType: true,
        kycStatus: true,
        createdAt: true,
        isAdmin: true,
        accounts: {
          select: {
            account_number: true,
            balance: true,
            accountType: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

