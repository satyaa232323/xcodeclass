import { NextResponse } from "next/server";

// sementara simpan data di memory
let courses: any[] = [];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const mentor = formData.get("mentor") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const thumbnail = formData.get("thumbnail") as File | null;

    if (!title || !mentor || !description || !price || !thumbnail) {
      return NextResponse.json(
        { error: "Semua input wajib diisi" },
        { status: 400 }
      );
    }

    const videos: string[] = [];
    formData.forEach((val, key) => {
      if (key.startsWith("video_")) {
        videos.push((val as File).name);
      }
    });

    const newCourse = {
      id: Date.now(),
      title,
      mentor,
      description,
      price,
      thumbnail: thumbnail.name,
      videos,
    };

    courses.push(newCourse);

    return NextResponse.json(newCourse);
  } catch (err) {
    return NextResponse.json({ error: "Gagal menyimpan course" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(courses);
}
