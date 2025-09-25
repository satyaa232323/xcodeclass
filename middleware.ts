import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Public routes that don't require authentication
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/classes",
    "/classes/[id]",
    "/"
  ];

  // Admin routes that require ADMIN role
  const adminRoutes = [
    "/admin",
    "/admin/dashboard",
    "/admin/courses",
    "admin/transactions"
  ];

  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || 
    pathname.startsWith("/classes/")
  );

  // Check if current path is admin route
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If no token exists, redirect to login
  if (!token) {
    const url = new URL('/auth/login', request.url);
    return NextResponse.redirect(url);
  }

    if(token && (pathname === '/auth/login' || pathname === '/auth/register')) {
        const url = new URL('/', request.url);
        return NextResponse.redirect(url);
    }

  try {
    // Decode the token to get user role
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role;

    // If trying to access admin routes without admin role
    if (isAdminRoute && userRole !== "ADMIN") {
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }

    // Allow access for authenticated users
    return NextResponse.next();

  } catch (error) {
    // If token is invalid, redirect to login
    const url = new URL('/auth/login', request.url);
    return NextResponse.redirect(url);
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|images).*)',
  ],
};