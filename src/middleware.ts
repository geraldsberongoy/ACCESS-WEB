import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const internalRoutes = ["/borrow"];
  const adminRoutes = ["/admin"];
  const authOnlyRoutes = ["/auth/reset-password"];

  const isAuthOnlyRoute = authOnlyRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isInternalRoute = internalRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Extract the role from metadata (synced by SQL triggers)
  const userRole = user?.app_metadata?.role;

  // 1. Guard unauthorized password resets
  if (!user && isAuthOnlyRoute) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  // 2. Guard unauthorized users
  if (!user && (isInternalRoute || isAuthOnlyRoute || isAdminRoute)) {
    // TODO: notification "sign in to continue"
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 3. Guard for /admin routes
  if (user && isAdminRoute) {
    if (userRole !== "Admin") {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  // Redirect authenticated users away from login/register
  if (user && (request.nextUrl.pathname === "/auth/login" || request.nextUrl.pathname === "/auth/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/borrow/:path*",
    "/auth/reset-password/:path*",
    "/auth/login",
    "/auth/register",
  ],
};