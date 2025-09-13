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
        
        // Add error handling for JSON parsing
        let body;
        try {
            body = await request.json();
        } catch (jsonError) {
            return new Response(
                JSON.stringify({ error: "Invalid JSON in request body" }), 
                { status: 400 }
            );
        }

        const { title, videoUrl, duration } = body;

        
        // Validate required fields
        if (!title || !videoUrl || !duration) {
            return new Response(
                JSON.stringify({ error: "Missing required fields: title, videoUrl, and duration are required" }), 
                { status: 400 }
            );
        }

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
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
