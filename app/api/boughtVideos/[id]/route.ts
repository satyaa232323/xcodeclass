import { PrismaClient } from "@/app/generated/prisma";
import { verivyJWT } from "@/lib/auth";


export async function GET(req: Request, { params }: { params: { id: string}}) {
    try {
        const prisma = new PrismaClient();

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ message: 'Authorization header missing' }), { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const payload = verivyJWT(token);
        if (!payload) {
            return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
        }

        // Find the specific UserClassVideo entry by its ID
        const boughtVideo = await prisma.userClassVideo.findFirst({
            where: {
                AND: [
                    { id: params.id },
                    { userId: (payload as {id: string}).id } // Ensure the user owns this entry
                ]
            },
            select: {
                id: true,
                purchaseDate: true,
                classObj: {
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
                                order: true
                            },
                            orderBy: {
                                order: 'asc'
                            }
                        }
                    }
                }
            }
        });

        if (!boughtVideo) {
            return new Response(JSON.stringify({ message: 'No purchased video found with this ID' }), { status: 404 });
        }

        return new Response(JSON.stringify(boughtVideo), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}