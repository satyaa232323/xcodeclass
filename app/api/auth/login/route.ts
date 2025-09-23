import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";
import { verifyPassword, generateJWT } from "@/lib/auth";
import { arcjetUtils } from "@/utils/archjet";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const aj = arcjetUtils();
export async function POST(req: NextRequest) {
    try {

        const decision = await aj.protect(req, { requested: 1 });



        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return NextResponse.json(
                    { error: "Too Many Requests", reason: decision.reason },
                    { status: 429 },
                );
            } else if (decision.reason.isBot()) {
                return NextResponse.json(
                    { error: "No bots allowed", reason: decision.reason },
                    { status: 403 },
                );
            } else {
                return NextResponse.json(
                    { error: "Forbidden", reason: decision.reason },
                    { status: 403 },
                );
            }
        }


        const { email, password } = await req.json();



        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Ambil user dulu berdasarkan email
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, password: true, role: true, name: true },
        });


        console.log("User fetched for login:", user);



        // protect endpoint rate limit



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
            name: user.name,
            role: user.role
        });

        (await cookies()).set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60, // 1 jam
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
            { status: 201 });
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
