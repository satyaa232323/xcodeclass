import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { arcjetUtils } from "@/utils/arcjet";
export async function POST(request: NextRequest) {
  const aj = arcjetUtils();

  const prisma = new PrismaClient();
  try {
    const decision = await aj.protect(request, { requested: 1 });

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

    const { token, email, newPassword } = await request.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpiry) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // hash token from request and compare with stored hashToken at DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    if (
      hashedToken !== user.resetPasswordToken ||
      user.resetPasswordExpiry < new Date()
    ) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // reset password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
      where: { email: email },
      data: {
        password: passwordHash,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
        passwordChangedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" + error },
      { status: 500 }
    );
  }
}
