import { PrismaClient } from "@/app/generated/prisma";
import { arcjetUtils } from "@/utils/arcjet";
import { verify } from "crypto";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const prisma = new PrismaClient();
  const aj = arcjetUtils();

  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { error: "Too Many Requests", reason: decision.reason },
          { status: 429 }
        );
      } else if (decision.reason.isBot()) {
        return NextResponse.json(
          { error: "No bots allowed", reason: decision.reason },
          { status: 403 }
        );
      } else {
        return NextResponse.json(
          { error: "Forbidden", reason: decision.reason },
          { status: 403 }
        );
      }
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
