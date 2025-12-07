import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordHashOnChain, toBytes32Hash, isBlockchainConfigured } from "@/lib/blockchain";

export async function POST(req: NextRequest) {
  try {
    const { fromAccountNumber, toAccountNumber, amount, remarks } =
      await req.json();
    const threshold = 3000;

    // Basic validation
    if (
      !fromAccountNumber ||
      !toAccountNumber ||
      !amount ||
      typeof amount !== "number" ||
      amount <= 0 ||
      amount > 50000
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Fetch accounts by account_number
    const fromAccount = await prisma.account.findUnique({
      where: { account_number: fromAccountNumber },
    });
    const toAccount = await prisma.account.findUnique({
      where: { account_number: toAccountNumber },
    });

    if (!fromAccount || !toAccount) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    if (fromAccount.account_id === toAccount.account_id) {
      return NextResponse.json(
        { error: "Cannot Transfer to the same account" },
        { status: 400 }
      );
    }
    if (Number(fromAccount.balance) < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }
    if (Number(fromAccount.balance) - amount < threshold) {
      return NextResponse.json(
        { error: "Minimum Balance must be maintained" },
        { status: 400 }
      );
    }

    // Atomic transaction: deduct, add, log
    const transaction = await prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { account_id: fromAccount.account_id },
        data: { balance: { decrement: amount } },
      });
      await tx.account.update({
        where: { account_id: toAccount.account_id },
        data: { balance: { increment: amount } },
      });
      return tx.transaction.create({
        data: {
          fromAccountId: fromAccount.account_id,
          toAccountId: toAccount.account_id,
          amount,
          remarks,
        },
      });
    });

    let blockchainHash: string | null = null;

    // Record transaction hash on blockchain (if configured)
    if (isBlockchainConfigured()) {
      try {
        const hashInput = JSON.stringify({
          id: transaction.id,
          fromAccountId: transaction.fromAccountId,
          toAccountId: transaction.toAccountId,
          amount: transaction.amount,
          remarks: transaction.remarks || "",
          createdAt: transaction.createdAt.toISOString(),
        });

        console.log("Hash input:", hashInput);

        const hashBytes32 = toBytes32Hash(hashInput);
        console.log("Generated hashBytes32:", hashBytes32);

        // Await the blockchain transaction
        await recordHashOnChain(hashBytes32).catch((error) => {
          console.error("Blockchain recording failed:", error);
        });

        blockchainHash = hashBytes32;
        console.log(`Transaction ${transaction.id} hash recorded on blockchain: ${hashBytes32}`);

        // Update transaction record with blockchain hash
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { blockchainHash },
        });
      } catch (error) {
        console.error("Error preparing blockchain record:", error);
      }
    } else {
      console.log("Blockchain not configured - skipping hash recording");
    }

    return NextResponse.json({ success: true, transaction, blockchainHash });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
