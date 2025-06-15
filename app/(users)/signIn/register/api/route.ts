// app/(users)/signIn/register/api/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const formData = await req.formData();

  // Extract files
  const aadhar = formData.get("aadhar") as File;
  const pan = formData.get("pan") as File;

  // Extract other fields
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const dobRaw = formData.get("dob"); // e.g., "2025-06-18"
  const dob = new Date(dobRaw as string); // ✅ Convert string to Date
  const crn = formData.get("crn") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const pincode = formData.get("pincode") as string;
  const accountType = formData.get("accountType") as string;
  const agreeStr = formData.get("agree");
  const agree = agreeStr === "true" || agreeStr === "on";

  const hashedPassword = await bcrypt.hash(password, 10);

  // Upload Aadhaar
  const aadharBuffer = Buffer.from(await aadhar.arrayBuffer());
  const aadharExt = aadhar.name.split(".").pop();
  const aadharPath = `kyc/${uuidv4()}-aadhar.${aadharExt}`;

  const { error: aadharErr } = await supabase.storage
    .from("documents")
    .upload(aadharPath, aadharBuffer, {
      contentType: aadhar.type,
    });

  if (aadharErr) {
    return NextResponse.json({ error: "Failed to upload Aadhaar" }, { status: 500 });
  }

  const aadharUrl = supabase.storage
    .from("documents")
    .getPublicUrl(aadharPath).data.publicUrl;

  // Upload PAN
  const panBuffer = Buffer.from(await pan.arrayBuffer());
  const panExt = pan.name.split(".").pop();
  const panPath = `kyc/${uuidv4()}-pan.${panExt}`;

  const { error: panErr } = await supabase.storage
    .from("documents")
    .upload(panPath, panBuffer, {
      contentType: pan.type,
    });

  if (panErr) {
    return NextResponse.json({ error: "Failed to upload PAN" }, { status: 500 });
  }

  const panUrl = supabase.storage
    .from("documents")
    .getPublicUrl(panPath).data.publicUrl;
    

  // Save to DB
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
      crn
    },
  });

  return NextResponse.json({ message: "User registered", user }, { status: 200 });
}
