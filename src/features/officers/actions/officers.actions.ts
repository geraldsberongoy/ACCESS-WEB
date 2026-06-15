"use server";

// ─────────────────────────────────────────────────────────────────────────
// OFFICER ACTIONS
// Purpose: Server Actions that validate form data and call services
// These are called from Client Components via form submissions or useActionState
// 
// Key Points:
// - "use server" ensures this code runs only on the backend
// - Receives FormData from HTML forms (not JSON)
// - Validates using Zod schemas
// - Calls service functions
// - Returns ActionState for frontend error handling
// ─────────────────────────────────────────────────────────────────────────

import { revalidatePath } from "next/cache";
import {
  CreateOfficerSchema,
  UpdateOfficerSchema,
  ReorderOfficersSchema,
} from "../schemas";
import {
  createOfficer,
  updateOfficer,
  deleteOfficer,
  reorderOfficers,
} from "../services/officers.services";

// ─────────────────────────────────────────────────────────────────────────
// ACTION STATE TYPE
// Represents the result of a server action
// - idle: Initial state, no action yet
// - success: Action completed without errors
// - error: Action failed with a message
// ─────────────────────────────────────────────────────────────────────────
type ActionState =
  | { status: "idle" }
  | { status: "success"; data?: unknown }
  | { status: "error"; message: string };

// ─────────────────────────────────────────────────────────────────────────
// CREATE OFFICER ACTION
// Called when: Admin submits the "Create Officer" form
// Input: FormData from HTML form
// Output: ActionState with success or error message
// ─────────────────────────────────────────────────────────────────────────
export async function createOfficerAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Step 1: Convert FormData to plain object
    // FormData is iterable: new Map(formData) converts it to key-value pairs
    const rawData = Object.fromEntries(formData);

    // Step 2: Validate data against schema
    // safeParse returns { success: boolean, data?, error? }
    const result = CreateOfficerSchema.safeParse(rawData);

    if (!result.success) {
      // Return first validation error message to user
      const errorMsg = result.error.issues
        .map((issue) => issue.message)
        .at(0) ?? "Invalid input";

      return {
        status: "error",
        message: errorMsg,
      };
    }

    // Step 3: Call service to insert into database
    const officer = await createOfficer(result.data);

    // Step 4: Revalidate cache so UI shows new officer immediately
    revalidatePath("/admin/officers", "layout");

    return {
      status: "success",
      data: officer,
    };
  } catch (err) {
    // Catch any errors from the service layer
    return {
      status: "error",
      message: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// UPDATE OFFICER ACTION
// Called when: Admin submits the "Edit Officer" form
// Input: FormData + officerId as hidden field
// Output: ActionState with success or error message
// ─────────────────────────────────────────────────────────────────────────
export async function updateOfficerAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Step 1: Extract officer ID from form
    const officerId = formData.get("id");
    if (!officerId || typeof officerId !== "string") {
      return {
        status: "error",
        message: "Officer ID is required",
      };
    }

    // Step 2: Convert FormData to object (excluding the id field)
    const rawData = Object.fromEntries(
      Array.from(formData.entries()).filter(([key]) => key !== "id")
    );

    // Step 3: Validate partial data against update schema
    // UpdateOfficerSchema has all fields optional
    const result = UpdateOfficerSchema.safeParse(rawData);

    if (!result.success) {
      const errorMsg = result.error.issues
        .map((issue) => issue.message)
        .at(0) ?? "Invalid input";

      return {
        status: "error",
        message: errorMsg,
      };
    }

    // Step 4: Call service to update the officer
    const officer = await updateOfficer(officerId, result.data);

    // Step 5: Revalidate cache
    revalidatePath("/admin/officers", "layout");

    return {
      status: "success",
      data: officer,
    };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// DEACTIVATE OFFICER ACTION
// Called when: Admin clicks "Deactivate" button (preferably with confirmation)
// Input: Officer ID
// Output: ActionState with success or error message
// ─────────────────────────────────────────────────────────────────────────
export async function deactivateOfficerAction(
  prevState: ActionState,
  officerId: string
): Promise<ActionState> {
  try {
    // Validate that we have an officer ID
    if (!officerId || typeof officerId !== "string") {
      return {
        status: "error",
        message: "Officer ID is required",
      };
    }

    // Call service to soft-delete the officer (set is_active to false)
    await deleteOfficer(officerId);

    // Revalidate cache
    revalidatePath("/admin/officers", "layout");

    return {
      status: "success",
    };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// REORDER OFFICERS ACTION
// Called when: Admin drags/drops officers to reorder them
// Input: JSON array of {id, display_order} objects
// Output: ActionState with success or error message
// ─────────────────────────────────────────────────────────────────────────
export async function reorderOfficersAction(
  prevState: ActionState,
  input: unknown // Will be validated against schema
): Promise<ActionState> {
  try {
    // Step 1: Validate the input against reorder schema
    // Input should be: { officers: [{id: string, display_order: number}, ...] }
    const result = ReorderOfficersSchema.safeParse(input);

    if (!result.success) {
      const errorMsg = result.error.issues
        .map((issue) => issue.message)
        .at(0) ?? "Invalid input";

      return {
        status: "error",
        message: errorMsg,
      };
    }

    // Step 2: Call service to update display_order for all officers
    await reorderOfficers(result.data);

    // Step 3: Revalidate cache
    revalidatePath("/admin/officers", "layout");

    return {
      status: "success",
    };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}
