import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await verifyAuth(request, "ADMIN");

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const prisma = new PrismaClient();

    try {
        const videoId = params.id;
        const body = await request.json();
        const { title, videoUrl, duration } = body;

        // Update the video
        const video = await prisma.video.update({
            where: {
                id: videoId,
            },
            data: {
                title,
                videoUrl,
                duration,
            },
        });

        return new Response(JSON.stringify(video), { status: 200 });
    } catch (error) {
        console.error("Update video error:", error);
        return new Response("Internal Server Error", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
