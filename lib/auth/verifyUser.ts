// lib/auth/verifyUser.ts
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_fallback_secret"
);

export interface AuthUser {
  crn: string;
  email: string;
  isAdmin: boolean;
  kycStatus: string | null;
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const crn = payload.crn as string;

    if (!crn) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { crn },
      select: { crn: true, email: true, isAdmin: true, kycStatus: true },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}
