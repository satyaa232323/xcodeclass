import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const prisma = new PrismaClient();
        const { id } = await params;

        const user = await verifyAuth(req, "USER")


        if (!user) {
            return NextResponse.json({ message: 'Authorization header missing' }, { status: 401 });
        }


        // Find the specific UserClassVideo entry by its ID

        const boughtVideo = await prisma.userClassVideo.findFirst({
            where: {
                AND: [
                    { classId: id },
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
                        mentor: true,
                        mentorProfileUrl: true,
                        thumbnailUrl: true,
                        createdAt: true,
                        updatedAt: true,
                        videos: {
                            select: {
                                id: true,
                                title: true,
                                videoUrl: true,
                                duration: true,
                                order: true,
                                thumbnailUrl: true
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
            return NextResponse.json({ message: 'No purchased video found with this ID' }, { status: 404 });
        }

        return NextResponse.json({data: boughtVideo }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}