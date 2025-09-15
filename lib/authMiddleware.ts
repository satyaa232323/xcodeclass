import { NextRequest } from "next/server";
import { verifyJWT } from "./auth";

export async function verifyAuth(request: NextRequest, requiredRole: "ADMIN" | "USER") {

    try {
        const authHeader = request.headers.get("Authorization");


        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        

        const token = authHeader.split(" ")[1];
        if(!token){
            return null;
        }

        const payload = verifyJWT(token);
        if (!payload) {
            return null;
        }


        if(requiredRole && payload.role !== requiredRole){
            return null;
        }

        return payload;


    }
    catch (error) {
        return null;
        console.error("Error verifying auth:", error);
    }

}

