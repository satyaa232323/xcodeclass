import { PrismaClient } from "@/app/generated/prisma";

export async function GET() {
    const prisma = new PrismaClient();

    try {
        const classes = await prisma.class.findMany({
            include: {
                userClassVideos: true,
            },
        });
        return new Response(JSON.stringify(classes), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}