import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {

    const prisma = new PrismaClient();

    try {

        const user = await verifyAuth(req, "ADMIN");

        if (!user) {
            return NextResponse.json({ error: "Unauthorized - only admins can add videos" }, { status: 401 });
        }


        const { id: classId } = await params;

        if (!classId) {
            return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
        }

        const body = await req.json();

        const { title, videoUrl, duration } = body;

        if (!title || !videoUrl || !duration) {
            return NextResponse.json({ error: "Fields 'title', 'videoUrl', 'duration', and 'order' are required" }, { status: 400 });
        }

        const existingClass = await prisma.class.findUnique({
            where: { id: classId }
        })

        if (!existingClass) {
            return NextResponse.json({ error: "Class not found" }, { status: 404 });
        }

        // save video into class

        const videoCount = await prisma.video.count({
            where: { classId: existingClass.id }
        });

        const order = videoCount + 1;
        const newVideo = await prisma.video.create({
            data: {
                title,
                videoUrl,
                duration,
                order,
                classId: existingClass.id
            }
        });

        return NextResponse.json(
            { message: "Video added successfully", video: newVideo },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to add video", detail: error },
            { status: 500 }
        );
    }
}


