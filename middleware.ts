import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/classes",
    "/classes/[id]",
    "/"
  ];

  const adminRoutes = [
    "/admin",
    "/admin/dashboard",
    "/admin/courses",
    "/admin/transactions"
  ];

  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Public check
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith("/classes/")
  );

  // Admin check
  const isAdminRoute = adminRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Public route tetap boleh diakses tanpa login
  if (isPublicRoute && !token) {
    return NextResponse.next();
  }

  // Kalau belum login, redirect ke login
  if (!token) {
    const url = new URL("/auth/login", request.url);
    return NextResponse.redirect(url);
  }

  try {
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userRole = payload.role;

    // Kalau udah login, tapi masih buka /auth/login atau /auth/register → redirect ke home
    if (pathname === "/auth/login" || pathname === "/auth/register") {
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Kalau route admin tapi bukan ADMIN → lempar ke home
    if (isAdminRoute && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Kalau ADMIN mencoba masuk ke public/user route → redirect ke dashboard
    if (userRole === "ADMIN" && !isAdminRoute) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // Kalau lolos semua cek → lanjut
    return NextResponse.next();
  } catch (error) {
    const url = new URL("/auth/login", request.url);
    return NextResponse.redirect(url);
  }
}

// Routes yang diproteksi
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|images).*)",
  ],
};
