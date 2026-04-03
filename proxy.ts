import { NextResponse, type NextRequest } from "next/server";
import {createSupabaseServerClient} from "@/lib/supabase/server-client";
/**
 * Next.js proxy (formerly middleware) entry point responsible for basic auth gating.
 *
 * Runtime assumptions due to conflicting docs (Next.js 16):
 * - Proxy runs in the Node.js runtime by default (not Edge)
 * - Node runtime grants access to the shared cookie store used by Supabase
 *
 * What happens per request:
 * - Instantiate the Supabase server client (shares cookies via `NextResponse`)
 * - Call `supabase.auth.getUser()` which refreshes tokens if necessary
 * - Redirect anonymous users away from `/protected` routes to `/login`
 *
 * Add extra path checks or redirects here when for more complex routing rules.
 */
export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log ({ user });

  // Redirect non-authenticated users away from protected routes
  const internalRoutes = ["/admin", "borrow", "events"];
  const isInternalRoute = internalRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  if (!user && isInternalRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect authenticated users from registration routes (avoids redundancy)
  if (user && (request.nextUrl.pathname === "/auth/login" || request.nextUrl.pathname === "/auth/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}