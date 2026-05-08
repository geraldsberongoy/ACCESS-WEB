// ─────────────────────────────────────────────────────────────────────────
// API ROUTE: /api/admin/officers/reorder
// 
// ENDPOINT:
// - POST: Bulk update display_order for multiple officers
// 
// AUTH: Admin only
// PURPOSE: Reorder officers for the carousel/landing page display
// ─────────────────────────────────────────────────────────────────────────

import { reorderOfficers } from "@/features/officers/services/officers.services";
import { ReorderOfficersSchema } from "@/features/officers/schemas";
import { AppError } from "@/lib/errors";
import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────
// POST: Bulk update display_order for officers
// 
// WHY SEPARATE ENDPOINT?
// - This is a bulk operation affecting multiple records
// - Separates reorder logic from individual CRUD operations
// - Easier to test and maintain
// 
// REQUEST BODY (JSON):
// {
//   "officers": [
//     { "id": "uuid-1", "display_order": 0 },
//     { "id": "uuid-2", "display_order": 1 },
//     { "id": "uuid-3", "display_order": 2 }
//   ]
// }
// 
// RESPONSE: Array of reordered officers
// ─────────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    // Step 1: Parse JSON request body
    const body = await req.json();

    // Step 2: Validate request data against reorder schema
    // This ensures:
    // - "officers" field exists
    // - It's an array with at least one item
    // - Each item has valid "id" (UUID) and "display_order" (positive int)
    const validatedData = ReorderOfficersSchema.safeParse(body);

    if (!validatedData.success) {
      // Collect all validation error messages
      const errorMsg = validatedData.error.issues
        .map((issue) => issue.message)
        .join(", ");

      throw new AppError(errorMsg, 400);
    }

    // Step 3: Call service to update all officers' display_order
    // The service handles updating each officer individually
    const reorderedOfficers = await reorderOfficers(validatedData.data);

    // Step 4: Return the reordered officers
    // Frontend can use this to confirm the new order
    return NextResponse.json({
      data: reorderedOfficers,
      count: reorderedOfficers.length,
      message: "Officers reordered successfully",
    });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
