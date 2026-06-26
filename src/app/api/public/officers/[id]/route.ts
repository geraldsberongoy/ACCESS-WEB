import { NextResponse, type NextRequest } from "next/server";
import { getPublicOfficerById } from "@/features/officers/services/officers.public.service";
import { AppError } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const officer = await getPublicOfficerById(id);
    return NextResponse.json(officer);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }

    console.error("[GET /api/public/officers/:id]", error);
    return NextResponse.json({ error: "Failed to fetch officer" }, { status: 500 });
  }
}