import { verifyJWT } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    try {
        const prisma = new PrismaClient();
        const user = await verifyAuth(req, "USER");
        
        console.log("Verified user in boughtClasses:", user);

        if (!user) {
            return new Response(JSON.stringify({ message: 'Authorization header missing' }), { status: 401 });
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
            return new Response(JSON.stringify({ message: "No bought classes found" }), { status: 404 });
        }

        return new Response(JSON.stringify(boughtClasses), { status: 200 });

    }
    catch (error) {
        return new Response(JSON.stringify({ message: "Internal server error", error }), { status: 500 });
    }



}

