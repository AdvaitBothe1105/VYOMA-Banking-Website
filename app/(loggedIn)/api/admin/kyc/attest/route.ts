import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ethers } from "ethers";
import KYCRegistryABI from "@/lib/abis/KYCRegistry.json";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";

// ---------- CONFIG ----------
const provider = new ethers.JsonRpcProvider(process.env.LOCAL_RPC_URL);
const adminWallet = new ethers.Wallet(
  process.env.WALLET_PRIVATE_KEY!,
  provider
);

const kycRegistry = new ethers.Contract(
  process.env.KYC_REGISTRY_ADDRESS!,
  KYCRegistryABI,
  adminWallet
);

// ---------- HELPERS ----------
function hashKYC(payload: object): `0x${string}` {
  const json = JSON.stringify(payload);
  return ethers.keccak256(
    ethers.toUtf8Bytes(json)
  ) as `0x${string}`;
}

// ---------- API ----------
export async function POST(req: NextRequest) {
  try {
    const { crn } = await req.json();

    if (!crn) {
      return NextResponse.json(
        { error: "CRN is required" },
        { status: 400 }
      );
    }

    // -------------------------
    // 1. Verify admin
    // -------------------------
    const adminCheck = await verifyAdmin(req);

    if (!adminCheck.isAdmin || adminCheck.error) {
      return adminCheck.error || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminCrn = adminCheck.crn!;

    // -------------------------
    // 2. Fetch user
    // -------------------------
    const user = await prisma.user.findUnique({
      where: { crn },
    });

    if (!user || !user.onchainAddress) {
      return NextResponse.json(
        { error: "User or wallet not found" },
        { status: 404 }
      );
    }

    if (user.kycStatus === "verified") {
      return NextResponse.json(
        { error: "KYC already verified" },
        { status: 400 }
      );
    }

    // -------------------------
    // 3. Prepare KYC hash
    // -------------------------
    const kycPayload = {
      crn: user.crn,
      aadharUrl: user.aadharUrl,
      panUrl: user.panUrl,
    };

    const kycHash = hashKYC(kycPayload);

    // -------------------------
    // 4. Call blockchain
    // -------------------------
    const tx = await kycRegistry.attestKYC(
      user.onchainAddress,
      kycHash
    );

    const receipt = await tx.wait();

    // -------------------------
    // 5. Update DB
    // -------------------------
    await prisma.user.update({
      where: { crn },
      data: {
        kycStatus: "verified",
      },
    });

    return NextResponse.json({
      success: true,
      txHash: receipt.hash,
      wallet: user.onchainAddress,
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "KYC attestation failed", details: err.message },
      { status: 500 }
    );
  }
}
