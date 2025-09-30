import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// GET all classes
export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req, "ADMIN");
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const classes = await prisma.class.findMany({
      include: {
        videos: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            duration: true,
            order: true
          }
        }
      }
    });

    return NextResponse.json({ data: classes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch classes", detail: error },
      { status: 500 }
    );
  }
}

// POST new class
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req, "ADMIN");
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, price, thumbnailUrl, mentor, mentorProfileUrl, videos } = body;

    const newClass = await prisma.class.create({
      data: {
        title,
        description,
        price,
        thumbnailUrl,
        mentor,
        mentorProfileUrl,
        videos: {
          create: videos.map((video: any, index: number) => ({
            title: video.title,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl || "",
            duration: video.duration || 0,
            order: video.order || index + 1
          }))
        }
      },
      include: {
        videos: true
      }
    });

    return NextResponse.json(
      { message: "Class created successfully", data: newClass },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      {
        error: "Failed to create class",
        detail: error?.message || "Unexpected error",
      },
      { status: 500 }
    );
  }
}
