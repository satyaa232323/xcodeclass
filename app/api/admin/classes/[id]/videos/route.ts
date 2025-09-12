import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

export async function POST(
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
        const body = await request.json();
        const { title, videoUrl, duration } = body;

        // cari jumlah video di class ini buat nentuin order selanjutnya
        const videoCount = await prisma.video.count({
            where: { classId },
        });

        const video = await prisma.video.create({
            data: {
                title,
                videoUrl,
                duration,
                classId,
                order: videoCount + 1, // 👈 isi order (urutan video)
            },
        });

        return new Response(JSON.stringify(video), { status: 201 });
    } catch (error) {
        console.error("Add video error:", error);
        return new Response("Internal Server Error", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
