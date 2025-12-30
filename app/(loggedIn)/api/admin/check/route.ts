import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "../auth";

export async function GET(req: NextRequest) {
  const adminCheck = await verifyAdmin(req);
  
  if (!adminCheck.isAdmin || adminCheck.error) {
    return NextResponse.json({ isAdmin: false });
  }

  return NextResponse.json({ isAdmin: true });
}

