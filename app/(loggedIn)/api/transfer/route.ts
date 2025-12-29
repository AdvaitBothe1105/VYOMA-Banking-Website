import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decryptPrivateKey } from "@/lib/walletCrypto";
import {
  getVyoBalance,
  transferVyoFromUser,
} from "@/lib/vyomaToken";
import {
  recordHashOnChain,
  toBytes32Hash,
  isBlockchainConfigured,
} from "@/lib/blockchain";

import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  process.env.LOCAL_RPC_URL!
);

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { fromAccountNumber, toAccountNumber, amount, remarks } =
      await req.json();

    const MIN_BALANCE = 3000;

    // -------------------------
    // 1. Basic validation
    // -------------------------
    if (
      !fromAccountNumber ||
      !toAccountNumber ||
      typeof amount !== "number" ||
      amount <= 0 ||
      amount > 50000
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    

    const fromAccount = await prisma.account.findUnique({
      where: { account_number: fromAccountNumber },
      include: { user: true },
    });

    const toAccount = await prisma.account.findUnique({
      where: { account_number: toAccountNumber },
      include: { user: true },
    });

    
    if (!fromAccount || !toAccount) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (fromAccount.account_id === toAccount.account_id) {
      return NextResponse.json(
        { error: "Cannot transfer to same account" },
        { status: 400 }
      );
    }

    if (!fromAccount.user?.onchainAddress || !toAccount.user?.onchainAddress) {
      return NextResponse.json(
        { error: "Blockchain wallet not found" },
        { status: 400 }
      );
    }

    // -------------------------
    // 2. On-chain balance check (SOURCE OF TRUTH)
    // -------------------------
    const onchainBalance = await getVyoBalance(
      fromAccount.user.onchainAddress
    );

    if (onchainBalance < amount) {
      return NextResponse.json(
        { error: "Insufficient on-chain balance" },
        { status: 400 }
      );
    }

    if (onchainBalance - amount < MIN_BALANCE) {
      return NextResponse.json(
        { error: "Minimum balance must be maintained" },
        { status: 400 }
      );
    }
    const ethBalance = await provider.getBalance(
      fromAccount.user.onchainAddress
    );
    
    if (ethBalance === BigInt(0)) {
      return NextResponse.json(
        { error: "Wallet not funded for gas" },
        { status: 400 }
      );
    }

    // -------------------------
    // 3. Execute blockchain transfer
    // -------------------------
    if (!fromAccount.user.encryptedPrivateKey) {
      throw new Error("Sender wallet private key missing");
    }

    const senderPrivateKey = decryptPrivateKey(
      fromAccount.user.encryptedPrivateKey
    );

    const receipt = await transferVyoFromUser(
      senderPrivateKey,
      toAccount.user.onchainAddress,
      amount
    );

    const onchainTxHash = receipt.hash;

    // -------------------------
    // 4. DB mirror update (AFTER blockchain success)
    // -------------------------
    const transaction = await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { account_id: fromAccount.account_id },
        data: {
          balance: onchainBalance - amount, // mirror
        },
      });

      await tx.account.update({
        where: { account_id: toAccount.account_id },
        data: {
          balance: { increment: amount },
        },
      });

      return tx.transaction.create({
        data: {
          fromAccountId: fromAccount.account_id,
          toAccountId: toAccount.account_id,
          amount,
          remarks,
          blockchainHash: onchainTxHash,
        },
      });
    });

    // -------------------------
    // 5. Optional audit hash (TxHashStore)
    // -------------------------
    // if (isBlockchainConfigured()) {
    //   const hashInput = JSON.stringify({
    //     id: transaction.id,
    //     from: fromAccount.account_number,
    //     to: toAccount.account_number,
    //     amount,
    //     onchainTxHash,
    //     createdAt: transaction.createdAt.toISOString(),
    //   });

    //   const hashBytes32 = toBytes32Hash(hashInput);
    //   await recordHashOnChain(hashBytes32);
    // }
    if (isBlockchainConfigured()) {
      try {
        const hashInput = JSON.stringify({
              id: transaction.id,
              from: fromAccount.account_number,
              to: toAccount.account_number,
              amount,
              onchainTxHash,
              createdAt: transaction.createdAt.toISOString(),
            });
        const hashBytes32 = toBytes32Hash(hashInput);
        await recordHashOnChain(hashBytes32);
      } catch (e) {
        console.warn("Audit hash failed, skipping", e);
      }
    }

    return NextResponse.json({
      success: true,
      transaction,
      onchainTxHash,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Transfer failed", details: err.message },
      { status: 500 }
    );
  }
}
