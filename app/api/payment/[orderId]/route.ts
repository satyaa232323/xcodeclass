import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";
import { createMidtransTransaction } from "@/utils/midtrans";

const prisma = new PrismaClient();

export async function POST(
    request: NextRequest,
    { params }: { params: { orderId: string } }
) {
    try {
        // 🔑 Verify JWT token
        const user = await verifyAuth(request, "USER");
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderId } = params;

        // 🔎 Get order details (and ensure it belongs to the logged-in user)
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: user.id,
                status: "PENDING",
            },
            include: {
                user: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found or already processed" }, { status: 404 });
        }

        // 🏦 Create Midtrans transaction
        const transaction = await createMidtransTransaction(
            order.orderNumber,
            order.totalAmount,
            order.user.email,
            order.user.name || "Customer"
        );

        // 💾 Update order dengan midtransOrderId
        await prisma.order.update({
            where: { id: order.id },
            data: { midtransOrderId: transaction.order_id },
        });

        return NextResponse.json({
            message: "Payment session created",
            orderId: order.id,
            midtransOrderId: transaction.order_id, // "APP-101"
            token: transaction.token,
            redirectUrl: transaction.redirect_url,
        });

    } catch (error) {
        console.error("Payment session error:", error);
        return NextResponse.json(
            { error: "Failed to create payment session" },
            { status: 500 }
        );
    }
};
