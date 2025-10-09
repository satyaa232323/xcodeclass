import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const user = await verifyAuth(request, "ADMIN");

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    try {
        const { id: orderId } = await context.params;

        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
            },
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
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        console.error("Get order details error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
