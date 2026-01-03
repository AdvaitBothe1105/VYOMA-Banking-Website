import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import KYCRegistryABI from "@/lib/abis/KYCRegistry.json";
import { verifyAdmin } from "../../auth";

const provider = new ethers.JsonRpcProvider(process.env.LOCAL_RPC_URL);
const kycRegistry = new ethers.Contract(
  process.env.KYC_REGISTRY_ADDRESS!,
  KYCRegistryABI,
  provider
);

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Verify admin access
  const adminCheck = await verifyAdmin(req);

  if (!adminCheck.isAdmin || adminCheck.error) {
    return adminCheck.error || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const address = req.nextUrl.searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Check if address is verified on blockchain
    const isVerified = await kycRegistry.isVerified(address);

    return NextResponse.json({
      isVerified: Boolean(isVerified)
    });
  } catch (err: any) {
    console.error("Blockchain status check error:", err);
    return NextResponse.json(
      { error: "Failed to check blockchain status", details: err.message },
      { status: 500 }
    );
  }
}