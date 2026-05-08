// ─────────────────────────────────────────────────────────────────────────
// API ROUTE: /api/admin/officers
// 
// ENDPOINTS:
// - GET:  Fetch all officers
// - POST: Create a new officer
// 
// AUTH: Admin only
// PURPOSE: Manage officers via REST API (alternative to server actions)
// ─────────────────────────────────────────────────────────────────────────

import { getAllOfficers } from "@/features/officers/services/officers.services";
import { createOfficer } from "@/features/officers/services/officers.services";
import { CreateOfficerSchema } from "@/features/officers/schemas";
import { AppError } from "@/lib/errors";
import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────
// GET: Fetch all officers
// ─────────────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    // Step 1: Call service to fetch all officers
    // includeInactive: true shows both active and inactive officers in admin view
    const officers = await getAllOfficers({ includeInactive: true });

    // Step 2: Return JSON response with officers array and count
    return NextResponse.json({
      data: officers,
      count: officers.length,
    });
  } catch (err: unknown) {
    // Error handling: Convert AppError to HTTP response
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────
// POST: Create a new officer
// 
// REQUEST BODY (JSON):
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
// ─────────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    // Step 1: Parse JSON request body
    const body = await req.json();

    // Step 2: Validate request data against schema
    // safeParse returns { success, data?, error? }
    const validatedData = CreateOfficerSchema.safeParse(body);

    if (!validatedData.success) {
      // Collect all validation error messages
      const errorMsg = validatedData.error.issues
        .map((issue) => issue.message)
        .join(", ");

      throw new AppError(errorMsg, 400);
    }

    // Step 3: Call service to insert officer into database
    const officer = await createOfficer(validatedData.data);

    // Step 4: Return created officer with 201 status code
    return NextResponse.json(officer, { status: 201 });
  } catch (err: unknown) {
    // Error handling
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
