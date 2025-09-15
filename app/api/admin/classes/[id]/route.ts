import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log(id);

    const classData = await prisma.class.findUnique({
      where: { id },
      include: { videos: true },
    });
    if (!classData) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }
    return NextResponse.json(classData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch class" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();
    const { title, description, price, thumbnailUrl, mentor } = body;

    const updatedClass = await prisma.class.update({
      where: { id },
      data: { title, description, price, thumbnailUrl, mentor },
    });

    return NextResponse.json(updatedClass);
  } catch (error: any) {
    console.error("PUT /api/admin/classes/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update class" },
      { status: 500 }
    );
  }
}
