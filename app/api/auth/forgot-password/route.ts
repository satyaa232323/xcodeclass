import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {

    const prisma = new PrismaClient();
    try{

        const { token, email, newPassword } = await request.json();

        if(!token || !email || !newPassword) {
            return  NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(!user || !user.resetPasswordToken || !user.resetPasswordExpiry) {
            return  NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        // hash token from request and compare with stored hashToken at DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        if(hashedToken !== user.resetPasswordToken || user.resetPasswordExpiry < new Date()) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
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

        return  NextResponse.json(
            { message: "Password has been reset successfully" }, 
            { status: 200 }
        );
        
    } catch (error) {
        return  NextResponse.json({ message: "Internal Server Error" + error }, { status: 500 });
    }
}