import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type AdminSession = {
  userId: string;
  email: string | null;
};

export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/admin");
  }

  const { data: userRow, error } = await supabase
    .from("Users")
    .select("role, email")
    .eq("id", user.id)
    .maybeSingle();

  if (error || userRow?.role !== "Admin") {
    redirect("/404");
  }

  return {
    userId: user.id,
    email: userRow.email ?? user.email ?? null,
  };
}
