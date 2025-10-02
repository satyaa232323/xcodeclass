import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const  { id } = await params;

    const videoId = await prisma.class.findUnique({
      where: { id },
      select: {
        id: true,
        thumbnailUrl: true,
        title: true,
        mentor: true,
        mentorProfileUrl: true,
        description: true,
        price: true,
        createdAt: true,
        updatedAt: true,
        videos: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            duration: true,
          },
        },
      },
    });

    if (!videoId) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ data: videoId }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
