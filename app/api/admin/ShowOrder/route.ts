import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

export async function GET(request: NextRequest) {

    const user = await verifyAuth(request, "ADMIN");


    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = new PrismaClient();

    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                orderItems: {
                    select: {
                        id: true,
                        price: true,
                        classObj: {
                            select: {
                                id: true,
                                title: true,
                                price: true,
                            },
                        },
                    },
                }

            },
        });

        return NextResponse.json({ data: orders }, { status: 200 });
    } catch (error) {
        console.error("List orders error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
