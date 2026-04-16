"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    // Listen for auth changes (sign-in, sign-out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        // router.refresh() tells Next.js to fetch the latest data 
        // from the server without losing client-side state.
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return <>{children}</>;
}