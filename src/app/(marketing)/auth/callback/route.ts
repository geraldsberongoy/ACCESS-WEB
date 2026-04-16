import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { NextResponse } from "next/server";

/**
 * Callback function for password-reset
 * When the user clicks the reset link in their email, Supabase appends a ?code= to the callback URL. 
 * Exchanges that one-time code for a recovery session via exchangeCodeForSession(code)
 * If the code is invalid -> redirects to login with error url param
 * Redirects to /auth/reset-password?verified=true
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const next = searchParams.get("next") ?? "/auth/reset-password";

  if (error || errorCode) {
    return new NextResponse(null, { status: 404 });
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError && data.session) {
      return NextResponse.redirect(`${origin}${next}?verified=true`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=invalid_reset_link`);
}