import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";


export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const prisma = new PrismaClient();
        const user = await verifyAuth(req, "ADMIN");

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        const id = params.id;
        const body = await req.json();
        const { title, videoUrl, duration } = body;

        const updatedVideo = await prisma.video.update({
            where: { id },
            data: { title, videoUrl, duration },
        });


        return NextResponse.json(
            { message: "Video updated successfully", video: updatedVideo },
            { status: 200 }
        );

    } catch (error) {
        console.error("PUT /api/admin/classes/[id] error:", error);
        return NextResponse.json(
            { error: error || "Failed to update video" },
            { status: 500 }
        );
    }
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const prisma = new PrismaClient();

        const id = params.id;

        const user = await verifyAuth(req, "ADMIN");

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const existingVideo = await prisma.video.findUnique({
            where: { id }
        });

        if (!existingVideo) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        await prisma.video.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "Video deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete video", detail: error || error },
            { status: 500 }
        );
    }
}