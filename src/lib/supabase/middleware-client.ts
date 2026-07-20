import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "./database.types";

/**
 * Creates a Supabase client scoped to the middleware (proxy) context.
 * Reads/writes cookies on the raw NextRequest and NextResponse objects
 * so token refreshes actually propagate back to the browser.
 */
export function createSupabaseMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Sync to request so downstream Server Components see the update
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Sync to response so the browser saves the refreshed token
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Return both so the caller can pass through the mutated response
  return { supabase, response };
}