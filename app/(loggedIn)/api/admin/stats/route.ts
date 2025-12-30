import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "../auth";

export async function GET(req: NextRequest) {
  const adminCheck = await verifyAdmin(req);
  
  if (!adminCheck.isAdmin || adminCheck.error) {
    return adminCheck.error || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalUsers,
      totalAccounts,
      totalTransactions,
      totalBalance,
      kycPending,
      kycVerified,
      kycRejected,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.account.count(),
      prisma.transaction.count(),
      prisma.account.aggregate({
        _sum: { balance: true },
      }),
      prisma.user.count({ where: { kycStatus: "pending" } }),
      prisma.user.count({ where: { kycStatus: "verified" } }),
      prisma.user.count({ where: { kycStatus: "rejected" } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    const stats = {
      users: {
        total: totalUsers,
        recent: recentUsers,
        kyc: {
          pending: kycPending,
          verified: kycVerified,
          rejected: kycRejected,
        },
      },
      accounts: {
        total: totalAccounts,
        totalBalance: totalBalance._sum.balance || 0,
      },
      transactions: {
        total: totalTransactions,
      },
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

