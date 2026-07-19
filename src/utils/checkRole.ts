import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { throwSupabaseError } from "@/lib/errors";

export type Roles = {
  roles?: "Default" | "Organiztion" | "Pending" | "Admin" | null;
};

export async function checkRole({ roles = "Default" }: Roles) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const { data: userRow, error } = await supabase
    .from("Users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  throwSupabaseError(error);

  const userRole = userRow?.role;

  if (!userRole) {
    throw new Error(
      "Your account is missing a profile in public.Users. Sign out, register again, or ask an admin to create your user row."
    );
  }

  if (userRole !== roles) {
    throw new Error(
      `Access denied. Your role is ${userRole}. Required role: ${roles}.`
    );
  }
}