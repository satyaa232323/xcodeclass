import { verifyAuth } from "@/lib/authMiddleware";
import { verify } from "crypto";
import { NextRequest } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

export async function GET(request: NextRequest) {
    const user = await verifyAuth(request, "ADMIN");


    if(!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const prisma = new PrismaClient();

``

    try{

        const body = await request.json();

        const { title, description, price, image } = body;




    } catch (error) {
        console.error("Admin classes error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }    
}