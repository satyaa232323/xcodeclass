import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const prisma = new PrismaClient();


        const user = await verifyAuth(req, "USER")

        console.log("Verified user in my-classes videos:", user);``

        if (!user) {
            return new Response(JSON.stringify({ message: 'Authorization header missing' }), { status: 401 });
        }


        // Find the specific UserClassVideo entry by its ID

        const boughtVideo = await prisma.userClassVideo.findFirst({
            where: {
                AND: [
                    { classId: params.id },
                    { userId: (user as { id: string }).id } // Ensure the user owns this entry
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