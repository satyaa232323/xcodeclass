import { PrismaClient } from "@/app/generated/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const prisma = new PrismaClient();

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
    return NextResponse.json({ data: classes }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
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
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

