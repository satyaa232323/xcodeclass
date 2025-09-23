import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {

    try{

        (await cookies()).set({
            name: "token",
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            expires: new Date(0) // langsung kadaluarsa
        })

        return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}