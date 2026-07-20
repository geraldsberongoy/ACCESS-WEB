import { NextResponse, type NextRequest } from "next/server";
import { getPublicOfficers } from "@/features/officers/services/officers.public.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const officers = await getPublicOfficers();
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
    const start = (safePage - 1) * safeLimit;
    const data = officers.slice(start, start + safeLimit);

    return NextResponse.json({
      data,
      meta: {
        page: safePage,
        limit: safeLimit,
        total: officers.length,
        totalPages: Math.max(1, Math.ceil(officers.length / safeLimit)),
      },
    });
  } catch (error) {
    console.error("[GET /api/public/officers]", error);
    return NextResponse.json({ error: "Failed to fetch officers" }, { status: 500 });
  }
}