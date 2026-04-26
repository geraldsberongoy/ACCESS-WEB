import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { checkRole } from "@/utils/checkRole";

export type EventsFilter = {
  status?: "Published" | "Draft" | "All";
  page?: number;
  limit?: number;
};

export async function getEventsForAdmin({ status = "All", page = 1, limit = 10 }: EventsFilter = {}) {
  await checkRole({roles: "Admin"});
  const supabase = await createSupabaseServerClient();

  const max_rows = Math.min(limit, 50);
  const from = (page - 1) * limit;
  const to = from + max_rows - 1;

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

export async function getEventForAdminById(id: string) {
  await checkRole({roles: "Admin"});
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

export async function publishEventById(id: string) {
  await checkRole({roles: "Admin"});
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('Events')
    .update({ status: 'Published' })
    .eq('id', id);

  if (error) throw error;
}

export async function unpublishEventById(id: string) {
  await checkRole({roles: "Admin"});
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('Events')
    .update({ status: 'Draft' })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteEventById(id: string) {
  await checkRole({roles: "Admin"});
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('Events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export type EventProps = {
  title: string;
  content_description: string;
  event_date?: string;
  status: "Published" | "Draft";
  image_url?: string; 
};

export async function postEvent(event: EventProps) {
  await checkRole({roles: "Admin"});
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("Events")
    .insert({
      title: event.title,
      content_description: event.content_description,
      event_date: event.event_date || null, 
      status: event.status ?? "Draft",
      image_url: event.image_url,
      created_by: user?.id,
      created_at: new Date().toISOString(),
      updated_at: null
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export type UpdateEventProps = Partial<EventProps>;

export async function editEvent(id: string, event: UpdateEventProps) {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("Events")
    .update({
      ...event,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}