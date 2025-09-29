import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";
const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  try {

    const user = await verifyAuth(req, "ADMIN");

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    console.log(id);

    const classData = await prisma.class.findUnique({
      where: { id },
      include: { videos: true },
    });

    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }
    return NextResponse.json({ data: classData }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch class" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const mentor = formData.get("mentor") as string;
  const thumbnailUrl = formData.get("thumbnailUrl") as string;

  // kalau ada file upload
  const file = formData.get("file"); // bisa null
  // handle file saving di sini kalau perlu

  const updatedClass = await prisma.class.update({
    where: { id },
    data: { title, description, price, mentor, thumbnailUrl },
  });


    return NextResponse.json(
      { message: "Class updated successfully", class: updatedClass },
      { status: 200 }
    );

  
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const user = await verifyAuth(req, "ADMIN");

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    await prisma.class.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Class deleted successfully" },
      { status: 200 }
    );


  } catch (error) {
    return NextResponse.json(
      { error: error || "Failed to delete class" },
      { status: 500 }
    );
  }
}
