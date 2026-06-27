import { NextResponse, type NextRequest } from "next/server";
import { getPublishedEvents } from "@/features/events/services/events.public.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const result = await getPublishedEvents({
      status: searchParams.get("status") as "upcoming" | "past" | "all" | null ?? undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/public/events]", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}