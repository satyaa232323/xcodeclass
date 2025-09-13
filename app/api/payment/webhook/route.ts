import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/authMiddleware";


const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {

        const user = await verifyAuth(request, "USER");

        let body: any = {};

        try {
            body = await request.json();
        } catch (error) {
            console.error("Error parsing request body:", error);
        }


        const { order_id, transaction_status, fraud_status } = body;


        // Verifikasi notifikasi dari Midtrans


        // const orderId = body.order_id; // ini "APP-xxxx"
        // const transactionStatus = body.transaction_status;
        // const fraudStatus = body.fraud_status;

        console.log(`Processing order ${order_id} with status ${transaction_status}`);

        // Cari order di database berdasarkan midtransOrderId
        const order = await prisma.order.findFirst({
            where: { midtransOrderId: order_id },
            include: {
                orderItems: true,
                user: true,
            },
        });

        if (!order) {
            console.error(`Order not found for midtransOrderId: ${order_id}`);
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Handle status transaksi
        switch (transaction_status) {
            case "capture":
                if (fraud_status === "challenge") {
                    await updateOrderStatus(order.id, "PENDING");

                } else if (fraud_status === "accept") {
                    await processSuccessfulPayment(order);
                }
                break;
            case "settlement":
                await processSuccessfulPayment(order);
                break;
            case "cancel":
            case "deny":
            case "expire":
                await updateOrderStatus(order.id, "FAILED");
                break;
            default:
                await updateOrderStatus(order.id, "PENDING");
        }

        return NextResponse.json({ status: "OK" });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Webhook processing failed", },
            { status: 500 }
        );
    }
}

async function processSuccessfulPayment(order: any) {
    try {
        // 1. Update order status
        await updateOrderStatus(order.id, "COMPLETED");

        // 2. Tambahkan user ke kelas (UserClassVideo)
        const createPromises = order.orderItems.map(async (item: any) => {
            const existingEntry = await prisma.userClassVideo.upsert({
                where: {
                    userId_classId: {
                        userId: order.userId,
                        classId: item.classId,
                    },
                },
                update: {},

                create: {
                    userId: order.userId,
                    classId: item.classId,
                    purchaseDate: new Date(),
                },
            });

            if (!existingEntry) {
                return prisma.userClassVideo.create({
                    data: {
                        userId: order.userId,
                        classId: item.classId,
                        purchaseDate: new Date(),
                    },
                });
            }

            if (!existingEntry) {
                return prisma.userClassVideo.create({
                    data: {
                        userId: order.userId,
                        classId: item.classId,
                        purchaseDate: new Date(),
                    },
                });
            }
        });

        await Promise.all(createPromises);
        console.log(`✅ Successfully processed payment for order ${order.id}`);
    } catch (error) {
        console.error(`❌ Error processing successful payment for order ${order.id}:`, error);
        throw error;
    }
}

async function updateOrderStatus(
    orderId: string,
    status: "COMPLETED" | "FAILED" | "PENDING"
) {
    await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
}
