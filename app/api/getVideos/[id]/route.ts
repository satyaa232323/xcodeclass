import { PrismaClient } from "@/app/generated/prisma";

export async function GET(req: Request, { params }: { params: { id: string}}) {
    const prisma = new PrismaClient();

    try {

        const videoId = await prisma.class.findUnique({
            where: { id: (params.id) },
            select: {
                id: true,
                title: true,
                description: true,
                price: true,
                createdAt: true,
                updatedAt: true,

                videos: {
                    select: {
                        id: true,
                        title: true,
                        videoUrl: true,
                        duration: true,
                    }
                }
            }
        });

        if (!videoId) {
            return new Response(JSON.stringify({ message: 'Video not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(videoId), { status: 200 });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }

}