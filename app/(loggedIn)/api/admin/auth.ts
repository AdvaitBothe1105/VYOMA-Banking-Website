import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your_fallback_secret");

export async function verifyAdmin(req: NextRequest): Promise<{ isAdmin: boolean; crn?: string; error?: NextResponse }> {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return {
      isAdmin: false,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const crn = payload.crn as string;

    if (!crn) {
      return {
        isAdmin: false,
        error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
      };
    }

    const user = await prisma.user.findUnique({
      where: { crn },
      select: { isAdmin: true },
    });

    if (!user || !user.isAdmin) {
      return {
        isAdmin: false,
        error: NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 }),
      };
    }

    return { isAdmin: true, crn };
  } catch (error) {
    return {
      isAdmin: false,
      error: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }
}

