"use client";
import { signOut } from "@/features/auth/actions/auth.actions";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function LogoutButton() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = getSupabaseBrowserClient();
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  });

  if (!user) return null;
  
  return (
    <form action={signOut}>
      <button type="submit" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">Logout</button>
      
    </form>
  );
}