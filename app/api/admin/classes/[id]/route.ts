import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";

const prisma = new PrismaClient();

// GET single class
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(req, "ADMIN");
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const classData = await prisma.class.findUnique({
      where: { id: params.id },
      include: {
        videos: true
      }
    });

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ data: classData }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch class", detail: error },
      { status: 500 }
    );
  }
}

// PATCH update class
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const user = await verifyAuth(req, "ADMIN");
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const body = await req.json();
    const videosData = body.videos || [];


    const existingClass = await prisma.class.findUnique({
      where: { id },
      include: { videos: true },
    });

    if (!existingClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }



    // cari ID dari video yang akan dihapus
    const videosIdsToKeep = videosData
    .filter((v: any) => v.id) // hanya yg punya id
    .map((v: any) => v.id);

    
    // hapus video yg tidak ada di videosIdsToKeep
    await prisma.video.deleteMany({
      where: {
        classId: id,
        id: {
          notIn: videosIdsToKeep
        }
      }
    });

    // pisahkan data class & videos
    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        mentor: body.mentor,
        mentorProfileUrl: body.mentorProfileUrl,
        thumbnailUrl: body.thumbnailUrl,
        videos: {
          // 🔹 Update video lama
          update: videosData
            .filter((v: any) => v.id) // hanya yg punya id
            .map((v: any) => ({
              where: { id: v.id },
              data: {
                title: v.title,
                thumbnailUrl: v.thumbnailUrl,
                videoUrl: v.videoUrl,
                duration: v.duration,
                order: v.order,
              },
            })),

          // 🔹 Tambah video baru
          create: videosData
            .filter((v: any) => !v.id) // hanya yg belum punya id
            .map((v: any) => ({
              title: v.title,
              thumbnailUrl: v.thumbnailUrl,
              videoUrl: v.videoUrl,
              duration: v.duration,
              order: v.order,
            })),
        },
      },
      include: { videos: true },
    });


    return NextResponse.json({ data: updatedClass }, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update class", detail: error },
      { status: 500 }
    );
  }
}


// DELETE class
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const user = await verifyAuth(req, "ADMIN");
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.class.delete({
      where: { id: id }
    });

    return NextResponse.json(
      { message: "Class deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "", detail: error },
      { status: 500 }
    );
  }
}