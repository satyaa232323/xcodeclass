import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {

    const prisma = new PrismaClient();
    try{

        const { token, email, newPassword } = await request.json();

        if(!token || !email || !newPassword) {
            return new Response("Missing fields", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(!user || !user.resetPasswordToken || !user.resetPasswordExpiry) {
            return new Response("Invalid or expired token", { status: 400 });
        }

        // hash token from request and compare with stored hashToken at DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        if(hashedToken !== user.resetPasswordToken || user.resetPasswordExpiry < new Date()) {
            return new Response("Invalid or expired token", { status: 400 });
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
                passwordChangedAt: new Date()
            },
        });

        return new Response("Password has been reset successfully", { status: 200 });
        
    } catch (error) {
        return new Response("Internal Server Error" + error, { status: 500 });
    }
}