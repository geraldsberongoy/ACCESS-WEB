// ─────────────────────────────────────────────────────────────────────────
// API ROUTE: /api/admin/officers/[id]
// 
// ENDPOINTS:
// - GET:    Fetch a single officer by ID
// - PUT:    Update a single officer
// - DELETE: Deactivate a single officer (soft delete)
// 
// AUTH: Admin only
// PURPOSE: Individual officer operations via REST API
// ─────────────────────────────────────────────────────────────────────────

import {
  getOfficerById,
  updateOfficer,
  deleteOfficer,
} from "@/features/officers/services/officers.services";
import { UpdateOfficerSchema } from "@/features/officers/schemas";
import { AppError } from "@/lib/errors";
import { NextResponse } from "next/server";

// Next.js Route Context: automatically provides route parameters
interface RouteContext {
  params: {
    id: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────
// GET: Fetch a single officer by ID
// 
// URL: /api/admin/officers/[id]
// RESPONSE: Single officer object or 404 if not found
// ─────────────────────────────────────────────────────────────────────────
export async function GET(
  req: Request,
  { params }: RouteContext
) {
  try {
    // Step 1: Extract officer ID from URL parameter
    const officerId = params.id;

    // Step 2: Call service to fetch officer by ID
    // If officer not found, service throws AppError with 404 status
    const officer = await getOfficerById(officerId);

    // Step 3: Return officer as JSON
    return NextResponse.json(officer);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────
// PUT: Update a single officer
// 
// URL: /api/admin/officers/[id]
// REQUEST BODY (JSON, all fields optional):
// {
//   "full_name": "Antonio Torres",
//   "email": "antonio@pup.edu.ph",
//   "position_title": "President",
//   "department": "Computer Engineering",
//   "academic_year": "2025-2026",
//   "image_url": "https://storage.url/officers/antonio.jpg",
//   "is_active": true,
//   "display_order": 1
// }
// 
// RESPONSE: Updated officer object
// ─────────────────────────────────────────────────────────────────────────
export async function PUT(
  req: Request,
  { params }: RouteContext
) {
  try {
    // Step 1: Extract officer ID from URL parameter
    const officerId = params.id;

    // Step 2: Parse JSON request body
    const body = await req.json();

    // Step 3: Validate request data against update schema
    // Note: UpdateOfficerSchema has all fields optional
    // This allows partial updates of officer data
    const validatedData = UpdateOfficerSchema.safeParse(body);

    if (!validatedData.success) {
      // Collect all validation error messages
      const errorMsg = validatedData.error.issues
        .map((issue) => issue.message)
        .join(", ");

      throw new AppError(errorMsg, 400);
    }

    // Step 4: Call service to update officer
    const officer = await updateOfficer(officerId, validatedData.data);

    // Step 5: Return updated officer as JSON
    return NextResponse.json(officer);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────
// DELETE: Deactivate a single officer (soft delete)
// 
// URL: /api/admin/officers/[id]
// METHOD: DELETE
// RESPONSE: Updated officer object with is_active set to false
// 
// WHY SOFT DELETE?
// - Preserves historical data for audit trails
// - If this officer was linked to past borrow requests, we keep the record
// - The officer can be reactivated if deleted by mistake
// ─────────────────────────────────────────────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: RouteContext
) {
  try {
    // Step 1: Extract officer ID from URL parameter
    const officerId = params.id;

    // Step 2: Call service to soft-delete officer
    // This sets is_active to false instead of hard-deleting from database
    const officer = await deleteOfficer(officerId);

    // Step 3: Return the updated officer showing it's now inactive
    return NextResponse.json(officer);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
