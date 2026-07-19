import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const internalRoutes = ["/borrow"];
  const adminRoutes = ["/admin"];
  const authOnlyRoutes = ["/auth/reset-password"];

  const pathname = request.nextUrl.pathname;
  const isAuthOnlyRoute = authOnlyRoutes.some((route) => pathname.startsWith(route));
  const isInternalRoute = internalRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userRole = user?.app_metadata?.role;

  if (!user && isAuthOnlyRoute) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  if (!user && (isInternalRoute || isAuthOnlyRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (user && isAdminRoute && userRole !== "Admin") {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  const authEntryPaths = ["/auth", "/auth/login", "/auth/register"];
  if (user && authEntryPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/borrow/:path*",
    "/auth/reset-password/:path*",
    "/auth",
    "/auth/login",
    "/auth/register",
  ],
};
