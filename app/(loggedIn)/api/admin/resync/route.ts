import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ethers } from "ethers";
import { getVyoBalance, mintVyo } from "@/lib/vyomaToken";
import { fundUserForGas } from "@/lib/gasfunding";
import { verifyAdmin } from "../auth";

const provider = new ethers.JsonRpcProvider(
  process.env.LOCAL_RPC_URL!
);

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Verify admin access
  const adminCheck = await verifyAdmin(req);

  if (!adminCheck.isAdmin || adminCheck.error) {
    return adminCheck.error || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { crn, action } = await req.json();

    if (!crn) {
      return NextResponse.json(
        { error: "CRN is required" },
        { status: 400 }
      );
    }

    if (!action || !["SYNC_FROM_CHAIN", "SYNC_FROM_DB"].includes(action)) {
      return NextResponse.json(
        { error: "Valid action required: SYNC_FROM_CHAIN or SYNC_FROM_DB" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { crn },
      include: { accounts: true }
    });

    if (!user || !user.onchainAddress) {
      return NextResponse.json(
        { error: "Wallet not found for user" },
        { status: 404 }
      );
    }

    // Get current balances
    const chainVyo = await getVyoBalance(user.onchainAddress);
    const chainEth = await provider.getBalance(user.onchainAddress);
    const ethBalance = parseFloat(ethers.formatEther(chainEth));

    // Get DB balance (from account)
    const dbBalance = user.accounts && user.accounts.length > 0 ? user.accounts[0].balance : 0;

    let performedAction = action;
    let updatedBalances = {
      eth: ethBalance,
      vyo: chainVyo
    };

    if (action === "SYNC_FROM_CHAIN") {
      // Strategy A: Sync DB from blockchain
      if (user.accounts && user.accounts.length > 0) {
        await prisma.account.update({
          where: { crn },
          data: { balance: chainVyo }
        });
      }
      performedAction = "SYNC_FROM_CHAIN";
    } else if (action === "SYNC_FROM_DB") {
      // Strategy B: Re-mint from DB (DEV ONLY)
      if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
          { error: "SYNC_FROM_DB is only available in development mode" },
          { status: 403 }
        );
      }

      // Fund ETH if needed
      if (ethBalance < 0.001) {
        await fundUserForGas(user.onchainAddress, "0.01");
        // Update eth balance after funding
        const newEthBalance = await provider.getBalance(user.onchainAddress);
        updatedBalances.eth = parseFloat(ethers.formatEther(newEthBalance));
      }

      // Mint VYO tokens to match DB balance
      if (Number(dbBalance) > 0) {
        await mintVyo(user.onchainAddress, Number(dbBalance));
        updatedBalances.vyo = Number(dbBalance);
      }

      performedAction = "SYNC_FROM_DB";
    }

    // Log the reconciliation
    await prisma.reconciliationLog.create({
      data: {
        crn: user.crn,
        walletAddress: user.onchainAddress,
        action: performedAction,
        chainVyo,
        dbBalance,
        ethBalance,
        performedBy: adminCheck.crn || "admin"
      }
    });

    return NextResponse.json({
      success: true,
      action: performedAction,
      balances: updatedBalances,
      message: `Wallet resynced successfully via ${performedAction}`
    });

  } catch (err: any) {
    console.error("Resync error:", err);
    return NextResponse.json(
      { error: "Resync failed", details: err.message },
      { status: 500 }
    );
  }
}