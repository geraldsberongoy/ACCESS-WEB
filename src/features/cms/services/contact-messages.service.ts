import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { checkRole } from "@/utils/checkRole";
import type { Tables } from "@/lib/supabase/database.types";

export type ContactMessage = Tables<"ContactMessages">;

export async function submitContactMessage(input: {
  full_name: string;
  email: string;
  course_year_section: string;
  contact_number: string;
  organization: string;
  purpose: string;
  concern: string;
}) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ContactMessages")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getContactMessagesForAdmin(options?: {
  unreadOnly?: boolean;
  limit?: number;
}) {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("ContactMessages")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.unreadOnly) {
    query = query.eq("is_read", false);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function markContactMessageRead(id: string) {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("ContactMessages")
    .update({ is_read: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUnreadContactMessageCount(): Promise<number> {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from("ContactMessages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) throw error;
  return count ?? 0;
}
