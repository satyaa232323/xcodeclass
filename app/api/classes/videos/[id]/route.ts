import { PrismaClient } from "@/app/generated/prisma";
import { verifyAuth } from "@/lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const prisma = new PrismaClient();

    try {

        const user = await verifyAuth(req, "USER");

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

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
            return NextResponse.json({ message: 'Video not found' }, { status: 404 });
        }

        return NextResponse.json({ data: videoId }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }

}