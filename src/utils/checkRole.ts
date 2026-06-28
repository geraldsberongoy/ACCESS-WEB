import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { AppError } from "@/lib/errors";

export type Roles = {
  roles?: "Default" | "Organization" | "Pending" | "Admin" | null;
};

export async function checkRole({ roles = "Default" }: Roles) {
  const supabase = await createSupabaseServerClient();
  // Extract the role from metadata (synced by SQL triggers)
  const { data: { user } } = await supabase.auth.getUser();
  const userRole = user?.app_metadata?.role;

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  if (userRole !== roles) {
    throw new AppError("Forbidden", 403);
  }
}