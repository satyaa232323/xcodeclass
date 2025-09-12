import { NextRequest } from "next/server";
import { verifyJWT } from "./auth";

export async function verifyAuth(request: NextRequest, requiredRole: "ADMIN" | "USER") {
    const token = request.headers.get("Authorization")?.split(" ")[1];


    if(!token) {
        return null;
    }

    const payload = verifyJWT(token);
    if(!payload){
        return null;
    }

    if(payload.role && payload.role !== requiredRole){
        return null;
    }

    return payload;
}

