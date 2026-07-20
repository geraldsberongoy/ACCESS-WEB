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

import {
  createOfficer,
  getOfficersForAdmin,
} from "@/features/officers/services/officers.admin.service";
import { CreateOfficerSchema } from "@/features/officers/schemas";
import { AppError, toErrorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────
// GET: Fetch all officers
// ─────────────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    // Step 1: Parse query params for pagination and filters
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? "1") || 1;
    const limit = Number(searchParams.get("limit") ?? "10") || 10;
    const statusParam = searchParams.get("status") ?? "All";
    const status = ["All", "Active", "Inactive"].includes(statusParam)
      ? (statusParam as "All" | "Active" | "Inactive")
      : "All";
    const search = searchParams.get("q") ?? "";

    const { data, meta } = await getOfficersForAdmin({
      page,
      limit,
      status,
      search,
    });

    // Step 2: Return officers and pagination metadata
    return NextResponse.json({
      data,
      meta,
      count: meta.total,
    });
  } catch (err: unknown) {
    return toErrorResponse(err);
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
    return toErrorResponse(err);
  }
}
