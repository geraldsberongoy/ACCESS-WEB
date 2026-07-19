import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { AppError, throwSupabaseError } from "@/lib/errors";

export type Roles = {
  roles?: "Default" | "Organization" | "Pending" | "Admin" | null;
};

export async function checkRole({ roles = "Default" }: Roles) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userRole = user?.app_metadata?.role;

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  const { data: userRow, error } = await supabase
    .from("Users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  throwSupabaseError(error);

  const userRole = userRow?.role;

  if (!userRole) {
    throw new AppError(
      "Your account is missing a profile in public.Users. Sign out, register again, or ask an admin to create your user row.",
      403
    );
  }

  if (userRole !== roles) {
    throw new AppError("Forbidden", 403);
  }
}
