import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest } from "next/server";
import crypto, { hash } from "crypto";

export async function POST(request: NextRequest) {

    const prisma = new PrismaClient();

    try {
        const { email } = await request.json();

        const availableEmail = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(!email ||  !availableEmail) {
            return new Response("Email not found", { status: 404 });
        }

        // Generate a password reset token

        const resetToken = crypto.randomBytes(32).toString('hex');

        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        console.log(resetToken);
        // Save the token to the database with an expiration time (e.g., 1 hour)
        const tokenExpiration = new Date(Date.now() + 3600000); // 1 hour from now

        // Update user with reset token and expiration
        await prisma.user.update({
            where: { email: email },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpiry: tokenExpiration
            }
        });

        return new Response("Password reset token generated" + resetToken, { status: 200 });


        // Here, you would typically send the reset token to the user's email address.




        

    } catch (error) {
        return new Response("Internal Server Error" + error, { status: 500 });
    }

}