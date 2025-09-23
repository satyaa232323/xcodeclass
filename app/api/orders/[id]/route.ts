import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";
import { arcjetUtils } from "@/utils/archjet";

const prisma = new PrismaClient();
const aj = arcjetUtils();

export async function POST(req: NextRequest, {params}: {params: {id: string}}) {
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
        console.log("User making order:", user);




       const { id } = await params;
        console.log("Class ID from params:", id);




        // Validate request body
        // const classId = body.classId || body.classId; // fallback




        console.log("classId:", id);

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