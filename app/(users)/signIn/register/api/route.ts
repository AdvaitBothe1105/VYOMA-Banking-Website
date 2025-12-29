import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { ethers } from "ethers";
import crypto from "crypto";
import { mintVyo } from "@/lib/vyomaToken";
import { fundUserForGas } from "@/lib/gasfunding";
// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// AES-256-GCM encryption helper
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

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // -------------------------
    // Extract documents
    // -------------------------
    const aadhar = formData.get("aadhar") as File;
    const pan = formData.get("pan") as File;

    // -------------------------
    // Extract fields
    // -------------------------
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const dob = new Date(formData.get("dob") as string);
    const crn = formData.get("crn") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const pincode = formData.get("pincode") as string;
    const accountType = formData.get("accountType") as string;
    const agreeStr = formData.get("agree");
    const agree = agreeStr === "true" || agreeStr === "on";

    const hashedPassword = await bcrypt.hash(password, 10);

    // -------------------------
    // Upload Aadhaar
    // -------------------------
    const aadharBuffer = Buffer.from(await aadhar.arrayBuffer());
    const aadharPath = `kyc/${uuidv4()}-aadhar.${aadhar.name.split(".").pop()}`;

    await supabase.storage
      .from("documents")
      .upload(aadharPath, aadharBuffer, { contentType: aadhar.type });

    const aadharUrl = supabase.storage
      .from("documents")
      .getPublicUrl(aadharPath).data.publicUrl;

    // -------------------------
    // Upload PAN
    // -------------------------
    const panBuffer = Buffer.from(await pan.arrayBuffer());
    const panPath = `kyc/${uuidv4()}-pan.${pan.name.split(".").pop()}`;

    await supabase.storage
      .from("documents")
      .upload(panPath, panBuffer, { contentType: pan.type });

    const panUrl = supabase.storage
      .from("documents")
      .getPublicUrl(panPath).data.publicUrl;

    // -------------------------
    // STEP 1 — Create custodial wallet
    // -------------------------
    const wallet = ethers.Wallet.createRandom();
    const onchainAddress = wallet.address;
    const encryptedPrivateKey = encryptPrivateKey(wallet.privateKey);

    // -------------------------
    // STEP 2 — Create user
    // -------------------------
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        dob,
        address,
        city,
        state,
        pincode,
        accountType,
        aadharUrl,
        panUrl,
        agree,
        crn,
        onchainAddress,
        encryptedPrivateKey,
        walletStatus: "created",
        kycStatus: "pending",
      },
    });

    // -------------------------
    // STEP 3 — Create account
    // -------------------------
    function generateAccountNumber(): string {
      return "AC" + Math.floor(1000000000 + Math.random() * 9000000000);
    }

    console.log("[register] Creating core account record", {
      crn,
      name,
      onchainAddress,
    });

    const account = await prisma.account.create({
      data: {
        crn,
        name,
        account_number: generateAccountNumber(),
        accountType,
        balance: 0,
      },
    });

    console.log("[register] Core account created", {
      accountId: account.account_id,
      accountNumber: account.account_number,
    });

    console.log("[register] Calling fundUserForGas", { onchainAddress });
    await fundUserForGas(onchainAddress);
    console.log("[register] fundUserForGas completed");
    // -------------------------
    // STEP 4 — Mint initial VYO
    // -------------------------
    const INITIAL_BALANCE = 5000;

    await mintVyo(onchainAddress, INITIAL_BALANCE);

    // -------------------------
    // STEP 5 — Sync DB mirror
    // -------------------------
    await prisma.account.update({
      where: { account_id: account.account_id },
      data: { balance: INITIAL_BALANCE },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        walletStatus: "funded",
        onchainBalance: INITIAL_BALANCE,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: user.id,
        accountNumber: account.account_number,
        onchainAddress,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Registration failed", details: err.message },
      { status: 500 }
    );
  }
}
