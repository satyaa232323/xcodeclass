import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { verifyAuth } from "@/lib/authMiddleware";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req, "ADMIN");

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert ke buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload ke Cloudinary (upload_large untuk video besar)
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        `data:video/mp4;base64,${buffer.toString("base64")}`, // kirim dalam bentuk data URI
        {
          resource_type: "video",
          format: "mp4",
          folder: "xcodeclass/videos",
          quality: "auto",
          eager: [
            {
              format: "jpg",
              transformation: [
                { width: 800, height: 450, crop: "fill" },
                { quality: "auto" },
              ],
              resource_type: "video",
            },
          ],
          eager_async: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Ambil thumbnail (kalau ada)
    const thumbnailUrl =
      uploadResult.eager?.[0]?.secure_url ||
      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/w_800,h_450,c_fill,q_auto/${uploadResult.public_id}.jpg`;

    return NextResponse.json({
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      duration: uploadResult.duration,
      thumbnail_url: thumbnailUrl,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}
