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
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload video pakai upload_stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "xcodeclass/videos",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    // Setelah upload selesai, trigger eager_async thumbnail
    await cloudinary.uploader.explicit(uploadResult.public_id, {
      resource_type: "video",
      type: "upload",
      eager: [
        {
          format: "jpg",
        },
      ],
      eager_async: true, // proses di background
    });

    // Fallback: dynamic URL thumbnail (langsung bisa dipakai walau eager belum ready)
    const thumbnailUrl = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/video/upload/so_2,w_800,h_450,c_fill,q_auto/${uploadResult.public_id}.jpg`;

    return NextResponse.json({
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      duration: uploadResult.duration,
      thumbnail_url: thumbnailUrl, // bisa langsung dipakai
    });

  } catch (err: any) {
    console.error("Video upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload video", details: err.message },
      { status: 500 }
    );
  }
}
