import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await verifyAuth(request, "ADMIN");

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const prisma = new PrismaClient();

  try {
    const orderId = params.id;

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
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Get order details error:", error);
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
