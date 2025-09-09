import { verivyJWT } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma";
export async function GET(req: Request) {

    try{
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

        const boughtClasses = await prisma.userClassVideo.findMany({
            where: {
                userId: (payload as {id: string}).id
            },
            include: {
                classObj: true, 
            }
        });

        if(!boughtClasses){
            return new Response(JSON.stringify({message: "No bought classes found"}), {status: 404});
        }

        return new Response(JSON.stringify(boughtClasses), {status: 200});

    }
    catch (error){
        return new Response(JSON.stringify({message: "Internal server error", error}), {status: 500});
    }
   
    

}
    
