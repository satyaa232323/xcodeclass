import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await verifyAuth(request, "ADMIN");

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const prisma = new PrismaClient();

    try {
        const classId = params.id;

        // Delete the class
        await prisma.class.delete({
            where: {
                id: classId,
            },
        });

        return new Response(JSON.stringify({ message: "Class deleted successfully" }), {
            status: 200,
        });
    } catch (error) {
        console.error("Delete class error:", error);
        return new Response("Internal Server Error", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
