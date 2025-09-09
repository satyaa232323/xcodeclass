import { hashPassword } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";

export  async function POST(req: Request) {
    const prisma = new PrismaClient();

    try {
        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return new Response(JSON.stringify({ message: 'Name, email and password are required' }), { status: 400 });
        }

        const exsistingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (exsistingUser) {
            return new Response(JSON.stringify({ message: 'User already exists' }), { status: 409 });
        }

        const hashedPassword  = await hashPassword(password);

        const user = await prisma.user.create({
            data: { 
                email, 
                password: hashedPassword, 
                name 
            }
        })

        return new Response(JSON.stringify({ message: 'User created', user: { id: user.id, email: user.email, name: user.name, role: user.role } }), { status: 201 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }


}