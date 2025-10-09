import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { verifyAuth } from "@/lib/authMiddleware";
import { arcjetUtils } from "@/utils/arcjet";

const aj = arcjetUtils();

export async function POST(req: NextRequest,   context: { params: Promise<{ id: string }> }) {
    try {

        const decision = await aj.protect(req, { requested: 1 });


        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return NextResponse.json(
                    { error: "Too Many Requests", reason: decision.reason },
                    { status: 429 },
                );
            } else if (decision.reason.isBot()) {
                return NextResponse.json(
                    { error: "No bots allowed", reason: decision.reason },
                    { status: 403 },
                );
            } else {
                return NextResponse.json(
                    { error: "Forbidden", reason: decision.reason },
                    { status: 403 },
                );
            }
        }


        const user = await verifyAuth(req, "USER");

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }




        const { id } = await context.params;




        // Validate request body
        // const classId = body.classId || body.classId; // fallback





        if (!id) {
            return NextResponse.json(
                { error: "Class ID is required" },
                { status: 400 }
            );
        }



        const classes = await prisma.class.findUnique({
            where: {
                id: id,
            }
        });




        if (!classes) {
            return NextResponse.json(
                { error: "Classes not found" },
                { status: 404 }
            );
        }

        const alreadyOrdered = await prisma.orderItem.findFirst({
            where: {
                classId: classes.id,
                order: {
                    is: {
                        userId: user.id,
                        status: { in: ["PENDING"] },

                    }
                },
            },
        });


        if (alreadyOrdered) {
            return NextResponse.json(
                { error: "You have already ordered this class" },
                { status: 400 }
            );
        }



        // hitung total amount
        const totalAmount = classes.price;

        // Create order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount,
                orderItems: {
                    create: {
                        classId: classes.id,
                        price: classes.price
                    },
                },
            }, include: {
                orderItems: true
            }
        });

        return NextResponse.json({
            message: "Order created successfully", order
        }, { status: 201 });
    } catch (error) {
        console.error("Create order error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}


export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
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

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Check if order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or cannot be deleted" },
        { status: 404 }
      );
    }

    // Delete order
    await prisma.order.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
