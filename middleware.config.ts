import { NextResponse } from 'next/server'

export const config = {
    api: {
        bodyParser: false, // Disable body parsing, we'll handle raw body
    }
}

// Configure response size limits
export function configureApiRoute(handler: Function) {
    return async (req: Request, ...args: any[]) => {
        // Set response size limit to 100MB
        const response = await handler(req, ...args)
        response.headers.set('Transfer-Encoding', 'chunked')
        return response
    }
}