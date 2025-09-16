import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {

  try {

    const user = await verifyAuth(req, "ADMIN");

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const classes = await prisma.class.findMany({
      select: {
        id: true,
        thumbnailUrl: true,
        title: true,
        description: true,
        price: true,
        mentor: true,
      },
    });
    return NextResponse.json({ data: classes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch classes", detail: error || error },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    // 🔒 Hanya ADMIN
    const user = await verifyAuth(req, "ADMIN");
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - only admins can create classes" },
        { status: 401 }
      );
    }

    // 🔹 Ambil body request
    const body = await req.json();
    const { title, description, price, thumbnailUrl, mentor, videos } = body;

    // 🔹 Validasi fields
    if (!title || !price || !thumbnailUrl || !mentor) {
      return NextResponse.json({
        error: "Fields 'title', 'price', 'thumbnailUrl', and 'mentor' are required"
      }, { status: 400 });
    }

    if (videos && !Array.isArray(videos)) {
      return NextResponse.json({
        error: "Videos must be an array"
      }, { status: 400 });    
    }

    // 🔹 Validasi tiap video (jika ada)
    if (videos) {
      for (const [index, v] of videos.entries()) {
        if (!v.title || !v.videoUrl || !v.duration || typeof v.order !== "number") {
          return NextResponse.json(
            {
              error: `Invalid video data at index ${index}`,
              expected: { title: "string", videoUrl: "string", duration: "number", order: "number" }
            },
            { status: 400 }
          );
        }
      }
    }

    // 🔹 Simpan ke DB (nested create videos kalau ada)
    const newClass = await prisma.class.create({
      data: {
        title,
        description,
        price,
        thumbnailUrl,
        mentor,
        videos: {}
      },
      include: {
        videos: true, // supaya langsung kelihatan
      },
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
        }, { status: 500 });
   
  }
}
