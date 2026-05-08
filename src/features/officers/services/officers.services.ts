import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { AppError } from "@/lib/errors";
import { CreateOfficerInput, UpdateOfficerInput, ReorderOfficersInput } from "../schemas";
import { Database } from "@/lib/supabase/database.types";

// Type alias for easier reference
type Officer = Database["public"]["Tables"]["Officers"]["Row"];

// ─────────────────────────────────────────────────────────────────────────
// OFFICER SERVICES
// Purpose: Handle all database operations for Officers table
// Each function handles one specific operation (CRUD)
// All functions use Supabase Server Client for secure database access
// ─────────────────────────────────────────────────────────────────────────

/**
 * GET: Fetch all officers
 * 
 * @param {Object} options - Query options
 * @param {boolean} options.includeInactive - Include inactive officers (default: false)
 * @returns {Promise<Officer[]>} Array of officers
 * 
 * Flow:
 * 1. Create Supabase server client (runs on backend only)
 * 2. Query the Officers table, optionally filtering by is_active
 * 3. Order by display_order so they appear in the correct frontend order
 * 4. If error occurs, throw AppError with Supabase message
 * 5. Return officers array
 */
export async function getAllOfficers(
  options?: { includeInactive?: boolean }
): Promise<Officer[]> {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("Officers")
    .select("*")
    .order("display_order", { ascending: true });

  // Filter to only active officers unless specified otherwise
  if (!options?.includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) throw new AppError(error.message, 500);

  return data || [];
}

/**
 * GET: Fetch a single officer by ID
 * 
 * @param {string} officerId - The officer's UUID
 * @returns {Promise<Officer>} Single officer object
 * 
 * Flow:
 * 1. Create Supabase server client
 * 2. Query where id matches officerId
 * 3. Use single() to get exactly one result or throw if not found
 * 4. Return the officer
 */
export async function getOfficerById(officerId: string): Promise<Officer> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("Officers")
    .select("*")
    .eq("id", officerId)
    .single(); // Expects exactly one result, throws if 0 or many

  if (error) throw new AppError(error.message, error.code === "PGRST116" ? 404 : 500);

  return data;
}

/**
 * POST: Create a new officer
 * 
 * @param {CreateOfficerInput} input - Validated officer data from schema
 * @returns {Promise<Officer>} The newly created officer
 * 
 * Flow:
 * 1. Create Supabase server client
 * 2. Get the max display_order to auto-assign next order
 *    (this ensures new officers appear at the end of the carousel)
 * 3. If no officers exist yet, start with order = 1
 * 4. Insert new officer with auto-assigned display_order
 * 5. Return the created officer
 */
export async function createOfficer(
  input: CreateOfficerInput
): Promise<Officer> {
  const supabase = await createSupabaseServerClient();

  // Get the highest display_order to auto-assign the next one
  const { data: maxOrder } = await supabase
    .from("Officers")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const nextDisplayOrder = (maxOrder?.display_order ?? 0) + 1;

  // Insert the new officer
  const { data, error } = await supabase
    .from("Officers")
    .insert([
      {
        id: crypto.randomUUID(),
        full_name: input.full_name,
        email: input.email,
        position_title: input.position_title,
        department: input.department,
        academic_year: input.academic_year,
        image_url: input.image_url || null,
        is_active: input.is_active ?? true,
        display_order: input.display_order ?? nextDisplayOrder,
      },
    ])
    .select()
    .single(); // Return the created officer

  if (error) throw new AppError(error.message, 500);

  return data;
}

/**
 * PUT: Update an existing officer
 * 
 * @param {string} officerId - The officer's UUID to update
 * @param {UpdateOfficerInput} input - Partial officer data to update
 * @returns {Promise<Officer>} The updated officer
 * 
 * Flow:
 * 1. Create Supabase server client
 * 2. Build update object with only provided fields
 * 3. Update where id matches officerId
 * 4. Return the updated officer
 */
export async function updateOfficer(
  officerId: string,
  input: UpdateOfficerInput
): Promise<Officer> {
  const supabase = await createSupabaseServerClient();

  // Build update object with only provided fields
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

  if (error) throw new AppError(error.message, 404);

  return data;
}

/**
 * DELETE: Soft-delete an officer (mark as inactive)
 * 
 * @param {string} officerId - The officer's UUID to delete
 * @returns {Promise<Officer>} The updated officer (now inactive)
 * 
 * Flow:
 * 1. Create Supabase server client
 * 2. Set is_active to false (soft delete)
 *    This preserves the officer record for audit trails
 * 3. Return the updated officer showing it's now inactive
 */
export async function deleteOfficer(officerId: string): Promise<Officer> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("Officers")
    .update({ is_active: false })
    .eq("id", officerId)
    .select()
    .single();

  if (error) throw new AppError(error.message, 404);

  return data;
}

/**
 * PATCH: Reorder multiple officers in bulk
 * 
 * @param {ReorderOfficersInput} input - Array of {id, display_order} objects
 * @returns {Promise<Officer[]>} All reordered officers
 * 
 * Flow:
 * 1. Create Supabase server client
 * 2. Loop through each officer in the input array
 * 3. Update each officer's display_order individually
 * 4. Collect all updated officers
 * 5. Return the full updated list
 * 
 * Why not use a single transaction?
 * - Supabase RLS policies work better with individual updates
 * - Easier to track which updates succeed/fail
 * - Simple enough use case doesn't need transaction overhead
 */
export async function reorderOfficers(
  input: ReorderOfficersInput
): Promise<Officer[]> {
  const supabase = await createSupabaseServerClient();

  const updatedOfficers: Officer[] = [];

  // Update each officer's display_order
  for (const { id, display_order } of input.officers) {
    const { data, error } = await supabase
      .from("Officers")
      .update({ display_order })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new AppError(
        `Failed to reorder officer ${id}: ${error.message}`,
        500
      );
    }

    updatedOfficers.push(data);
  }

  return updatedOfficers;
}
