import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";

export async function POST(
    request: NextRequest,
    { params }: { params: { classId: string } }
) {
    try {

        const prisma = new PrismaClient();

        // Verify JWT token
        const user = await verifyAuth(request, "USER");
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const classId = params.classId;



        // check if user already bought the class
        const existingAccess = await prisma.userClassVideo.findUnique({
            where: {
                userId_classId: {
                    userId: user.id,
                    classId: classId
                }
            }
        });

        if (existingAccess) {
            return NextResponse.json({ error: "You already own this class" }, { status: 400 });
        }


        // Get class details
        const classData = await prisma.class.findUnique({
            where: { id: classId },
        });



        if (!classData) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }

        // Create order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount: classData.price,
                status: "PENDING",
                orderItems: {
                    create: {
                        classId: classData.id,
                        price: classData.price,
                    },
                },
            },
            include: { orderItems: true },
        });

        return NextResponse.json({
            message: "Order created successfully",
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                status: order.status,
            },
        });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}