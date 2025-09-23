import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET as string;
export function generateJWT(payload: object) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "24h" // Increase token lifetime
    });
}

export function verifyJWT(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET,) as {
            id: string;
            name: string;
            email: string;
            role: "ADMIN" | "USER";
        };
    } catch (error) {
        return null;
    }
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}