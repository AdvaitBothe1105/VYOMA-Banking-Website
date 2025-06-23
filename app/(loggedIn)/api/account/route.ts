import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request){
    const crn = new URL(req.url).searchParams.get("crn");

    if(!crn){
        return NextResponse.json({error:"CRN is required"}, { status:400});

    }

    const account = await prisma.account.findFirst({
        where: {crn},
        select: {
          account_id: true,
          crn: true,
          accountType: true,
          account_number: true,
          balance: true,
          name: true,
          created_at: true,
        },
    });

    if (!account) {
        return NextResponse.json({error: "User Not Found"}, {status: 404});
    }

    return NextResponse.json(account );
}