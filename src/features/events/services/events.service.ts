import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export type EventsFilter = {
  status?: "Published" | "Draft" | "All";
  page?: number;
  limit?: number;
};

export async function getEvents({ status = "All", page = 1, limit = 10 }: EventsFilter = {}) {
  const supabase = await createSupabaseServerClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("Events")
    .select("id, title, content_description, event_date, status, image_url", { count: "exact" });

  if (status !== "All") {
    query = query.eq("status", status);
  }

  query = query
    .order("event_date", { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data,
    meta: { 
      page, 
      limit, 
      total: count ?? 0, 
      totalPages: Math.ceil((count ?? 0) / limit) 
    },
  };
}

export async function getEventById(id: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("Events")
    .select("id, title, content_description, event_date, status, image_url, created_at, updated_at")
    .eq("id", id)
    .eq("status", "Published")
    .single();

  if (error) throw error;
  return data;
}