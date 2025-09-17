import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyPassword, generateJWT } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }


        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const token = generateJWT({
            id: user.id,
            email: user.email,
            role: user.role
        });

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        },
            { status: 200 });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
