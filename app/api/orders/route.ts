import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    // Handle GET request

    const user = await verifyAuth(req, "USER");
}