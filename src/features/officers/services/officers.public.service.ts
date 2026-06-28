import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { AppError } from "@/lib/errors";
import { Database } from "@/lib/supabase/database.types";

type Officer = Database["public"]["Tables"]["Officers"]["Row"];

export async function getPublicOfficers(): Promise<Officer[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("Officers")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) throw new AppError(error.message, 500);

  return data || [];
}

export async function getPublicOfficerById(officerId: string): Promise<Officer> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("Officers")
    .select("*")
    .eq("id", officerId)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new AppError("Officer not found", 404);
    }

    throw new AppError(error.message, 500);
  }

  return data;
}
