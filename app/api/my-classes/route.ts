import { verifyJWT } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    try {
        const prisma = new PrismaClient();
        const user = await verifyAuth(req, "USER");
        
        console.log("Verified user in boughtClasses:", user);

        if (!user) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }


        const boughtClasses = await prisma.userClassVideo.findMany({
            where: {
                userId: (user as { id: string }).id
            },
            include: {
                classObj: true,
            }
        });

        if (!boughtClasses) {
            return NextResponse.json({ message: "No bought classes found" }, { status: 404 });
        }

        return NextResponse.json({ data: boughtClasses }, { status: 200 });

    }
    catch (error) {
        console.error("Error in boughtClasses:", error);
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }



}

