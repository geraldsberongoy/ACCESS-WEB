import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { AppError } from "@/lib/errors";
import { Database, Json } from "@/lib/supabase/database.types";
import { checkRole } from "@/utils/checkRole";
import {
  CreateOfficerInput,
  ReorderOfficersInput,
  UpdateOfficerInput,
} from "../schemas";

type Officer = Database["public"]["Tables"]["Officers"]["Row"];

type DbError = {
  code?: string;
  message: string;
};

function toAppError(error: DbError, fallbackStatus = 500): AppError {
  if (error.code === "PGRST116" || error.code === "P0002") {
    return new AppError(error.message, 404);
  }

  if (error.code === "42501") {
    return new AppError(error.message, 403);
  }

  if (error.code === "23505") {
    return new AppError(error.message, 409);
  }

  if (error.code === "22P02") {
    return new AppError(error.message, 400);
  }

  return new AppError(error.message, fallbackStatus);
}

export type OfficersAdminFilter = {
  status?: "All" | "Active" | "Inactive";
  search?: string;
  page?: number;
  limit?: number;
};

export type OfficersPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function getOfficersForAdmin(
  { status = "All", search = "", page = 1, limit = 10 }: OfficersAdminFilter = {}
): Promise<{ data: Officer[]; meta: OfficersPaginationMeta }> {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const safePage = Math.max(page, 1);
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;

  let query = supabase.from("Officers").select("*", { count: "exact" });

  if (status === "Active") {
    query = query.eq("is_active", true);
  } else if (status === "Inactive") {
    query = query.eq("is_active", false);
  }

  const normalizedSearch = search.trim();
  if (normalizedSearch) {
    const escaped = normalizedSearch.replace(/,/g, "\\,");
    query = query.or(
      `full_name.ilike.%${escaped}%,email.ilike.%${escaped}%,position_title.ilike.%${escaped}%,department.ilike.%${escaped}%`
    );
  }

  const { data, error, count } = await query
    .order("display_order", { ascending: true })
    .range(from, to);

  if (error) throw new AppError(error.message, 500);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return {
    data: data || [],
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    },
  };
}

export async function getOfficerById(officerId: string): Promise<Officer> {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("Officers")
    .select("*")
    .eq("id", officerId)
    .single();

  if (error) throw toAppError(error);

  return data;
}

export async function createOfficer(input: CreateOfficerInput): Promise<Officer> {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .rpc("create_officer_atomic", {
      p_id: crypto.randomUUID(),
      p_full_name: input.full_name,
      p_email: input.email,
      p_position_title: input.position_title,
      p_department: input.department,
      p_academic_year: input.academic_year,
      p_image_url: input.image_url || null,
      p_is_active: input.is_active ?? true,
      p_display_order: input.display_order ?? null,
    })
    .single();

  if (error) throw toAppError(error);

  return data;
}

export async function updateOfficer(
  officerId: string,
  input: UpdateOfficerInput
): Promise<Officer> {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const updateData = {
    ...(input.full_name !== undefined && { full_name: input.full_name }),
    ...(input.email !== undefined && { email: input.email }),
    ...(input.position_title !== undefined && { position_title: input.position_title }),
    ...(input.department !== undefined && { department: input.department }),
    ...(input.academic_year !== undefined && { academic_year: input.academic_year }),
    ...(input.image_url !== undefined && { image_url: input.image_url || null }),
    ...(input.is_active !== undefined && { is_active: input.is_active }),
    ...(input.display_order !== undefined && { display_order: input.display_order }),
  };

  const { data, error } = await supabase
    .from("Officers")
    .update(updateData)
    .eq("id", officerId)
    .select()
    .single();

  if (error) throw toAppError(error);

  return data;
}

export async function deactivateOfficer(officerId: string): Promise<Officer> {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("Officers")
    .update({ is_active: false })
    .eq("id", officerId)
    .select()
    .single();

  if (error) throw toAppError(error);

  return data;
}

export async function reorderOfficers(input: ReorderOfficersInput): Promise<Officer[]> {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc("reorder_officers_atomic", {
    p_officers: input.officers as unknown as Json,
  });

  if (error) throw toAppError(error);

  return data ?? [];
}
