import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Secret key (must be a `Uint8Array`)
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your_fallback_secret");

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  console.log("🔐 Middleware running for:", request.nextUrl.pathname);
  if (!token) {
    console.warn("❌ No token found. Redirecting to /signIn.");
    return NextResponse.redirect(new URL("/signIn", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log("✅ Token verified for CRN:", payload.crn);
    return NextResponse.next();
  } catch (error) {
    console.error("❌ Invalid token. Redirecting to /signIn.", error);
    return NextResponse.redirect(new URL("/signIn", request.url));
  }
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"], // protect dashboard
};
