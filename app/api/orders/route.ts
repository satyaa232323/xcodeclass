import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";
import { arcjetUtils } from "@/utils/archjet";

const prisma = new PrismaClient();
const aj = arcjetUtils();

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAuth(req, "USER");


        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            include: {
                orderItems: {
                    include: {
                        classObj: true
                    }
                }
            }
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Get orders error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}


export async function POST(req: NextRequest) {
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

        const body = await req.json();
      



        // Validate request body
        const classId = body.classId || body.classId; // fallback




        console.log("classId:", classId);

        if (!classId) {
            return NextResponse.json(
                { error: "Class ID is required" },
                { status: 400 }
            );
        }



        const classes = await prisma.class.findUnique({
            where: {
                id: classId,
            }
        });




        if (!classes) {
            return NextResponse.json(
                { error: "Classes not found" },
                { status: 404 }
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
        });
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