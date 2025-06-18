import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { use } from "react";


export async function GET(req: Request){
    const crn = new URL(req.url).searchParams.get("crn");

    if(!crn){
        return NextResponse.json({error:"CRN is required"}, { status:400});

    }

    const user = await prisma.user.findUnique({
        where: {crn},
        select: {
          accountType: true,
          name: true,  
        },
    });

    if (!user) {
        return NextResponse.json({error: "User Not Found"}, {status: 404});
    }

    return NextResponse.json(user);
}