import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type Roles = {
  roles?: "Default" | "Organiztion" | "Pending" | "Admin" | null;
};

export async function checkRole({ roles = "Default" }: Roles) {
  const supabase = await createSupabaseServerClient();
  // Extract the role from metadata (synced by SQL triggers)
  const { data: { user } } = await supabase.auth.getUser();
  const userRole = user?.app_metadata?.role;

  if (userRole !== roles) {
    throw new Error("Invalid credentials!");
  }
} 