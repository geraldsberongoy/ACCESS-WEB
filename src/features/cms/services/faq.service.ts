import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { checkRole } from "@/utils/checkRole";
import type { Tables } from "@/lib/supabase/database.types";

export type FAQItem = Tables<"FAQItems">;

export async function getActiveFAQs(): Promise<FAQItem[]> {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("FAQItems")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getAllFAQsForAdmin(): Promise<FAQItem[]> {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("FAQItems")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createFAQItem(input: {
  question: string;
  answer: string;
  display_order?: number;
  is_active?: boolean;
}) {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("FAQItems")
    .insert({
      question: input.question,
      answer: input.answer,
      display_order: input.display_order ?? 0,
      is_active: input.is_active ?? true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFAQItem(
  id: string,
  input: Partial<{
    question: string;
    answer: string;
    display_order: number;
    is_active: boolean;
  }>
) {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("FAQItems")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFAQItem(id: string) {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("FAQItems").delete().eq("id", id);
  if (error) throw error;
}

export async function getFAQCount(): Promise<number> {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from("FAQItems")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}
