import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SuperSecretKey";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
   return await bcrypt.compare(password, hash);
}

export function generateJWT(payload: object){
    return jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});
}

export function verifyJWT(token: string){
    try{
        return jwt.verify(token, JWT_SECRET) as {id: string, email: string, role: "ADMIN" | "USER"};
    } catch (error) {
        return null;
    }
}