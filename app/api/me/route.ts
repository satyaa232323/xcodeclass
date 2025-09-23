import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const user = await verifyAuth(request, "USER");

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    });
}