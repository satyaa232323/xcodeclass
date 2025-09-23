import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const user = await verifyAuth(request, "USER");


    if (!user) {
        // user belum login → balikin null, bukan error
        return NextResponse.json({
            user: null,
        });
    }

    return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    });
}