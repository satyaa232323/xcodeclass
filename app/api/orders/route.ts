import { PrismaClient } from "@/app/generated/prisma";
import { verivyJWT } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const prisma = new PrismaClient();


        const authHeader = req.headers.get("Authorization");

        if (!authHeader) {
            return new Response(JSON.stringify({ message: "Authorization header missing" }), { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        // Verify token (you need to implement this function)
        const payload = verivyJWT(token);
        if (!payload) {
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
        }

        // find all orders for the user
        const orders = await prisma.order.findMany({
            where: {
                userId: (payload as { id: string }).id
            },
            select: {
                id: true,
                userId: true,
                status: true,
                midtransOrderId: true,
                orderItems: {
                    select: {
                        id: true,
                        classId: true,
                        price: true,
                    },
                },
                createdAt: true,
            }
        })

        if (!orders) {
            return new Response(JSON.stringify({ message: "No orders found for this user" }), { status: 404 });
        }

        return new Response(JSON.stringify(orders), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }

}