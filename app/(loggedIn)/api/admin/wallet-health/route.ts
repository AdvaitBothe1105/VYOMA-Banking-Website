import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ethers } from "ethers";
import { getVyoBalance } from "@/lib/vyomaToken";
import { verifyAdmin } from "../auth";

const provider = new ethers.JsonRpcProvider(
  process.env.LOCAL_RPC_URL!
);

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
    });

    if (!user || !user.onchainAddress) {
      return NextResponse.json(
        { error: "Wallet not found for user" },
        { status: 404 }
      );
    }

    // ---- Health checks ----
    const walletExists = !!user.onchainAddress;
    const custodyAvailable = !!user.encryptedPrivateKey;

    const ethBalance = await provider.getBalance(user.onchainAddress);
    const hasGas = ethBalance > 0;

    let vyoBalanceReadable = true;
    let vyoBalance = "0";

    try {
      vyoBalance = String(
        await getVyoBalance(user.onchainAddress)
      );
    } catch {
      vyoBalanceReadable = false;
    }

    const status =
      walletExists &&
      custodyAvailable &&
      hasGas &&
      vyoBalanceReadable
        ? "HEALTHY"
        : "UNHEALTHY";

    return NextResponse.json({
      wallet: user.onchainAddress,
      status,
      checks: {
        walletExists,
        custodyAvailable,
        ethGas: hasGas ? "OK" : "LOW",
        vyoReadable: vyoBalanceReadable,
      },
      balances: {
        eth: ethers.formatEther(ethBalance),
        vyo: vyoBalance,
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Health check failed", details: err.message },
      { status: 500 }
    );
  }
}

