import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const mentor = formData.get("mentor") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const thumbnail = formData.get("thumbnail") as File | null;
    const videos = formData.getAll("videos") as File[]; // multiple video files

    // Handle thumbnail upload
    let thumbnailUrl = "";
    if (thumbnail) {
      const bytes = await thumbnail.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}_${thumbnail.name}`;
      const uploadPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        filename
      );
      await writeFile(uploadPath, buffer);
      thumbnailUrl = `/uploads/${filename}`;
    }

    // Handle video uploads
    let videoUrls: string[] = [];
    for (const video of videos) {
      if (video && typeof video === "object" && "name" in video) {
        const bytes = await video.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}_${video.name}`;
        const uploadPath = path.join(
          process.cwd(),
          "public",
          "uploads",
          "videos",
          filename
        );
        await writeFile(uploadPath, buffer);
        videoUrls.push(`/uploads/videos/${filename}`);
      }
    }

    if (!title || !mentor) {
      return NextResponse.json(
        { error: "Title and mentor are required" },
        { status: 400 }
      );
    }

    // Simpan class ke database
    const newClass = await prisma.class.create({
      data: {
        title,
        mentor,
        description,
        price,
        thumbnailUrl,
        // Jika ingin simpan video ke tabel lain, tambahkan logic di sini
      },
    });

    // Jika ingin simpan video ke tabel Video, lakukan di sini
    // Contoh:
    for (let i = 0; i < videoUrls.length; i++) {
      await prisma.video.create({
        data: {
          classId: newClass.id,
          title: `Video ${i + 1}`,
          videoUrl: videoUrls[i],
          duration: 0, // Atur sesuai kebutuhan
          order: i + 1,
        },
      });
    }

    return NextResponse.json({ ...newClass, videoUrls }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create class", detail: error?.message || error },
      { status: 500 }
    );
  }
}
