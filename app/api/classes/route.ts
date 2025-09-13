import { PrismaClient } from "@/app/generated/prisma";
import { verify } from "crypto";

export async function GET(req: Request) {
    const prisma = new PrismaClient();


    try {
        const classes = await prisma.class.findMany({
            select: {
                id: true,
                thumbnailUrl: true,
                title: true,
                description: true,
                price: true,
                mentor: true,
            } 
        });
        return new Response(JSON.stringify(classes), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}