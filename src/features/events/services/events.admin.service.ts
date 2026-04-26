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
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error(`Event with id ${id} not found`);
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
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  // Fetch the image_url before deleting
  const { data: event, error: fetchError } = await supabase
    .from("Events")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) throw fetchError;

  // Delete image from storage if it exists
  if (event?.image_url) {
    const path = event.image_url.split("/access_web_assets/")[1]?.split("?")[0];
    if (path) {
      const { error: storageError } = await supabase.storage
        .from("access_web_assets")
        .remove([path]);

      if (storageError) console.error("[deleteEventById] Failed to delete image:", storageError);
    }
  }

  const { data, error } = await supabase
    .from("Events")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
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

export async function uploadEventImage(file: File): Promise<string> {
  const supabase = await createSupabaseServerClient();

  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = `events/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("access_web_assets") // replace with your bucket name
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
  .from("access_web_assets")
  .getPublicUrl(filePath);

  return data.publicUrl;
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
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error(`Event with id ${id} not found`);
  return data;
}