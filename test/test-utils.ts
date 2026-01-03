/**
 * Test Utilities for Vyoma Banking System
 * 
 * This file provides helper functions to quickly set up test users and accounts
 * without going through the full registration/login flow.
 */

// Load environment variables FIRST before any imports that use them
import dotenv from "dotenv";
dotenv.config();

// Validate critical environment variables before importing modules that use them
function validateEnvVars() {
  const required = [
    "DATABASE_URL",
    "JWT_SECRET",
    "MASTER_WALLET_ENCRYPTION_KEY",
    "LOCAL_RPC_URL",
    "WALLET_PRIVATE_KEY",
    "VYO_TOKEN_ADDRESS",
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Validate DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL!;
  try {
    const url = new URL(dbUrl);
    if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") {
      throw new Error(`Invalid DATABASE_URL protocol. Expected postgresql:// or postgres://`);
    }
    // Check if password exists (even if empty, it should be present in URL)
    if (!url.password && url.username) {
      console.warn("⚠️  DATABASE_URL has username but no password. This might cause connection issues.");
    }
  } catch (error: any) {
    if (error.code === "ERR_INVALID_URL") {
      throw new Error(
        `Invalid DATABASE_URL format. Expected: postgresql://user:password@host:port/database\n` +
        `Got: ${dbUrl.substring(0, 50)}...\n` +
        `Note: If your password contains special characters, URL-encode them (e.g., @ becomes %40)`
      );
    }
    throw error;
  }

  // Validate private key format
  const privateKey = process.env.WALLET_PRIVATE_KEY!;
  if (!privateKey.startsWith("0x") || privateKey.length !== 66) {
    throw new Error(
      `Invalid WALLET_PRIVATE_KEY format. Expected: 0x followed by 64 hex characters (66 total). Got: ${privateKey.length} characters`
    );
  }
}

// Validate before importing
validateEnvVars();

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import crypto from "crypto";
// Import these dynamically to avoid module load errors
// import { mintVyo } from "@/lib/vyomaToken";
// import { fundUserForGas } from "@/lib/gasfunding";

// AES-256-GCM encryption helper (same as in registration route)
function encryptPrivateKey(pk: string): string {
  const masterKey = process.env.MASTER_WALLET_ENCRYPTION_KEY;
  if (!masterKey) throw new Error("MASTER_WALLET_ENCRYPTION_KEY missing");

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(masterKey, "hex"),
    iv
  );

  const encrypted = Buffer.concat([cipher.update(pk, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString(
    "hex"
  )}`;
}

/**
 * Generate a unique CRN for testing
 */
export function generateTestCRN(): string {
  return `TEST${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

/**
 * Generate a unique account number for testing
 */
export function generateTestAccountNumber(): string {
  return "AC" + Math.floor(1000000000 + Math.random() * 9000000000);
}

/**
 * Create a test user directly in the database (bypasses registration API)
 * 
 * @param options - User creation options
 * @returns Created user and account data
 */
export async function createTestUser(options?: {
  crn?: string;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  accountType?: string;
  initialBalance?: number;
  isAdmin?: boolean;
  kycStatus?: "pending" | "verified" | "rejected";
}) {
  const crn = options?.crn || generateTestCRN();
  const name = options?.name || `Test User ${crn}`;
  const email = options?.email || `test${crn}@example.com`;
  const password = options?.password || "test123456";
  const phone = options?.phone || `9${Math.floor(Math.random() * 1000000000)}`;
  const accountType = options?.accountType || "Savings";
  const initialBalance = options?.initialBalance ?? 5000;
  const isAdmin = options?.isAdmin || false;
  const kycStatus = options?.kycStatus || "pending";

  // Create blockchain wallet
  const wallet = ethers.Wallet.createRandom();
  const onchainAddress = wallet.address;
  const encryptedPrivateKey = encryptPrivateKey(wallet.privateKey);

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      crn,
      name,
      email,
      password: hashedPassword,
      phone,
      dob: new Date("1990-01-01"),
      address: "123 Test Street",
      city: "Test City",
      state: "Test State",
      pincode: "123456",
      aadharUrl: "https://example.com/test-aadhar.pdf",
      panUrl: "https://example.com/test-pan.pdf",
      accountType,
      agree: true,
      onchainAddress,
      encryptedPrivateKey,
      kycStatus,
      isAdmin,
    },
  });

  // Create account
  const account = await prisma.account.create({
    data: {
      crn,
      name,
      account_number: generateTestAccountNumber(),
      accountType,
      balance: 0, // Will be updated after minting
    },
  });

  // Fund wallet for gas
  try {
    const { fundUserForGas } = await import("@/lib/gasfunding");
    await fundUserForGas(onchainAddress);
  } catch (error) {
    console.warn("Failed to fund wallet for gas (might be expected in test env):", error);
  }

  // Mint initial tokens
  try {
    const { mintVyo } = await import("@/lib/vyomaToken");
    await mintVyo(onchainAddress, initialBalance);
  } catch (error) {
    console.warn("Failed to mint tokens (might be expected in test env):", error);
  }

  // Update account balance
  await prisma.account.update({
    where: { account_id: account.account_id },
    data: { balance: initialBalance },
  });

  return {
    user,
    account,
    password, // Return plain password for login
    onchainAddress,
  };
}

/**
 * Generate a JWT token for a user (bypasses login API)
 * 
 * @param crn - User's CRN
 * @param userId - User's ID (optional, will be fetched if not provided)
 * @returns JWT token
 */
export async function generateTestToken(crn: string, userId?: string): Promise<string> {
  let actualUserId = userId;
  
  if (!actualUserId) {
    const user = await prisma.user.findUnique({
      where: { crn },
      select: { id: true, isAdmin: true },
    });
    
    if (!user) {
      throw new Error(`User with CRN ${crn} not found`);
    }
    
    actualUserId = user.id;
  }

  const token = jwt.sign(
    { userId: actualUserId, crn },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" } // Longer expiry for testing
  );

  return token;
}

/**
 * Create a complete test setup: two users with accounts ready for transfer
 * 
 * @param options - Configuration options
 * @returns Both users, accounts, and tokens
 */
export async function createTestTransferSetup(options?: {
  senderBalance?: number;
  receiverBalance?: number;
}) {
  const senderBalance = options?.senderBalance ?? 10000;
  const receiverBalance = options?.receiverBalance ?? 5000;

  // Create sender
  const sender = await createTestUser({
    name: "Test Sender",
    email: `sender${Date.now()}@test.com`,
    initialBalance: senderBalance,
  });

  // Create receiver
  const receiver = await createTestUser({
    name: "Test Receiver",
    email: `receiver${Date.now()}@test.com`,
    initialBalance: receiverBalance,
  });

  // Generate tokens
  const senderToken = await generateTestToken(sender.user.crn, sender.user.id);
  const receiverToken = await generateTestToken(receiver.user.crn, receiver.user.id);

  return {
    sender: {
      ...sender,
      token: senderToken,
    },
    receiver: {
      ...receiver,
      token: receiverToken,
    },
  };
}

/**
 * Perform a fund transfer between two accounts (uses the actual transfer API logic)
 * 
 * @param fromAccountNumber - Sender's account number
 * @param toAccountNumber - Receiver's account number
 * @param amount - Transfer amount
 * @param remarks - Optional remarks
 * @returns Transaction details
 */
export async function performTestTransfer(
  fromAccountNumber: string,
  toAccountNumber: string,
  amount: number,
  remarks?: string
) {
  // Import transfer logic
  const { getVyoBalance, transferVyoFromUser } = await import("@/lib/vyomaToken");
  const { decryptPrivateKey } = await import("@/lib/walletCrypto");
  const { ethers } = await import("ethers");

  const provider = new ethers.JsonRpcProvider(process.env.LOCAL_RPC_URL!);
  const MIN_BALANCE = 3000;

  // Get accounts
  const fromAccount = await prisma.account.findUnique({
    where: { account_number: fromAccountNumber },
    include: { user: true },
  });

  const toAccount = await prisma.account.findUnique({
    where: { account_number: toAccountNumber },
    include: { user: true },
  });

  if (!fromAccount || !toAccount) {
    throw new Error("Account not found");
  }

  if (!fromAccount.user?.onchainAddress || !toAccount.user?.onchainAddress) {
    throw new Error("Blockchain wallet not found");
  }

  // Check on-chain balance
  const onchainBalance = await getVyoBalance(fromAccount.user.onchainAddress);

  if (onchainBalance < amount) {
    throw new Error("Insufficient on-chain balance");
  }

  if (onchainBalance - amount < MIN_BALANCE) {
    throw new Error("Minimum balance must be maintained");
  }

  // Check gas balance
  const ethBalance = await provider.getBalance(fromAccount.user.onchainAddress);
  if (ethBalance === BigInt(0)) {
    throw new Error("Wallet not funded for gas");
  }

  // Execute transfer
  if (!fromAccount.user.encryptedPrivateKey) {
    throw new Error("Sender wallet private key missing");
  }

  const senderPrivateKey = decryptPrivateKey(fromAccount.user.encryptedPrivateKey);
  const receipt = await transferVyoFromUser(
    senderPrivateKey,
    toAccount.user.onchainAddress,
    amount
  );

  const onchainTxHash = receipt.hash;

  // Update database
  const transaction = await prisma.$transaction(async (tx) => {
    await tx.account.update({
      where: { account_id: fromAccount.account_id },
      data: {
        balance: onchainBalance - amount,
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

  return {
    transaction,
    onchainTxHash,
    fromAccount: fromAccount.account_number,
    toAccount: toAccount.account_number,
    amount,
  };
}

/**
 * Clean up test data (delete users and accounts)
 * 
 * @param crns - Array of CRNs to delete
 */
export async function cleanupTestData(crns: string[]) {
  // Safety guard
  for (const crn of crns) {
    if (!crn.startsWith("TEST")) {
      throw new Error(`Refusing to delete non-test CRN: ${crn}`);
    }
  }

  await prisma.$transaction(async (tx) => {
    // 1. Find accounts for these users
    const accounts = await tx.account.findMany({
      where: { crn: { in: crns } },
      select: { account_id: true },
    });

    const accountIds = accounts.map(a => a.account_id);

    if (accountIds.length > 0) {
      // 2. Delete transactions (both directions)
      await tx.transaction.deleteMany({
        where: {
          OR: [
            { fromAccountId: { in: accountIds } },
            { toAccountId: { in: accountIds } },
          ],
        },
      });

      // 3. Delete accounts
      await tx.account.deleteMany({
        where: { account_id: { in: accountIds } },
      });
    }

    // 4. Delete users
    await tx.user.deleteMany({
      where: { crn: { in: crns } },
    });
  });
}


/**
 * Get account details by CRN
 */
export async function getAccountByCRN(crn: string) {
  return await prisma.account.findUnique({
    where: { crn },
    include: { user: true },
  });
}

