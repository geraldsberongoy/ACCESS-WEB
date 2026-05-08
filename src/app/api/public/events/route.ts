import { NextResponse, type NextRequest } from "next/server";
import { getPublishedEvents } from "@/features/events/services/events.public.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const valid_statuses = ["upcoming", "past", "all"] as const;
    type PublicStatus = typeof valid_statuses[number];

    const rawStatus = searchParams.get("status");
    const status: PublicStatus = valid_statuses.includes(rawStatus as PublicStatus) 
      ? (rawStatus as PublicStatus) 
      : "all";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const result = await getPublishedEvents({ status: status ?? "all", page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/public/events]", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}