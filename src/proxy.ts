import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware-client";

export async function proxy(request: NextRequest) {
  // The client and response are coupled, we must use the one returned here, 
  // not a new one since response may be mutated during token refresh
  const { supabase, response } = createSupabaseMiddlewareClient(request);

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

  // getUser() also triggers token refresh — must be called before routing logic
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    response.cookies.delete("sb-plzkphbuwfokfcopwlxv-auth-token");
  }
  const userRole = user?.app_metadata?.role;

  // 1. Guard unauthorized password resets
  if (!user && isAuthOnlyRoute) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  // 2. Guard unauthorized users
  if (!user && (isInternalRoute || isAuthOnlyRoute || isAdminRoute)) {
    // TODO: notification "sign in to continue"
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (user && isAdminRoute && userRole !== "Admin") {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  // Redirect authenticated users away from auth pages
  const authEntryPaths = ["/auth", "/auth/login", "/auth/register"];
  if (user && authEntryPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Return the response from the client factory, not a freshly constructed one
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/borrow/:path*",
    "/auth/reset-password/:path*",
    "/auth",
    "/auth/login",
    "/auth/register",
    "/"
  ],
};