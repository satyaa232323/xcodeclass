import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { verifyAuth } from "@/lib/authMiddleware";
import { createMidtransTransaction } from "@/utils/midtrans";
import { arcjetUtils } from "@/utils/arcjet";

const aj = arcjetUtils();
export async function POST(
  request: NextRequest,
   context: { params: Promise<{ orderId: string }> }
) {
  try {
    // 🔑 Verify JWT token

    const decision = await aj.protect(request, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { error: "Too Many Requests", reason: decision.reason },
          { status: 429 }
        );
      } else if (decision.reason.isBot()) {
        return NextResponse.json(
          { error: "No bots allowed", reason: decision.reason },
          { status: 403 }
        );
      } else {
        return NextResponse.json(
          { error: "Forbidden", reason: decision.reason },
          { status: 403 }
        );
      }
    }

    const user = await verifyAuth(request, "USER");
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await context.params;

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
      return NextResponse.json(
        { error: "Order not found or already processed" },
        { status: 404 }
      );
    }

    // 🏦 Create Midtrans transaction
    const transaction = await createMidtransTransaction(
      order.orderNumber,
      order.totalAmount,
      order.user.email,
      order.user.name || "Customer",
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
}
