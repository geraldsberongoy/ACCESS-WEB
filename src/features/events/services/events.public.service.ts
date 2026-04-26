import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type EventsFilterPublic = {
  status?: "upcoming" | "past" | "all";
  page?: number;
  limit?: number;
};

export async function getPublishedEvents({ status = "all", page = 1, limit = 10 }: EventsFilterPublic = {}) {
  const supabase = await createSupabaseServerClient();

  const max_rows = Math.min(limit, 50);
  const from = (page - 1) * limit;
  const to = from + max_rows - 1;

  let query = supabase
    .from("Events")
    .select("id, title, content_description, event_date, status, image_url", { count: "exact" })
    .eq("status", "Published")
    .order("event_date", { ascending: false })
    .range(from, to);

  const now = new Date().toISOString();
  if (status === "upcoming") query = query.gte("event_date", now);
  if (status === "past") query = query.lt("event_date", now);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data,
    meta: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
  };
}

export async function getPublishedEventById(id: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("Events")
    .select("id, title, content_description, event_date, status, image_url, created_at")
    .eq("id", id)
    .eq("status", "Published")
    .maybeSingle(); // returns null instead of throwing when not found

  if (error) throw error;
  return data;
}