import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
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
    return NextResponse.json(classes);
  } catch (error: any) {
    console.error(Error);
    return NextResponse.json(
      { error: "Failed to fetch classes", detail: error?.message || error },
      { status: 500 }
    );
  }
}
