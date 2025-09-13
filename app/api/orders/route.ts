import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

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
        const user = await verifyAuth(req, "USER");
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        console.log("Request body:", body);

      

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

        


        if(!classes){
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