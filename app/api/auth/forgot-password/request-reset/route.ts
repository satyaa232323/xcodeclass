import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto, { hash } from "crypto";
import { arcjetUtils } from "@/utils/arcjet";
export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  const aj = arcjetUtils();
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

    const { email } = await request.json();

    const availableEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!email || !availableEmail) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }

    // Generate a password reset token

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    console.log(resetToken);
    // Save the token to the database with an expiration time (e.g., 1 hour)
    const tokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user with reset token and expiration
    await prisma.user.update({
      where: { email: email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: tokenExpiration,
      },
    });

    return NextResponse.json(
      { message: "Password reset token generated", token: resetToken },
      { status: 200 }
    );

    // Here, you would typically send the reset token to the user's email address.
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" + error },
      { status: 500 }
    );
  }
}
