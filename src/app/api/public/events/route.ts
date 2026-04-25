import { NextResponse, type NextRequest } from "next/server";
import { getEvents } from "@/features/events/services/events.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") as "Published" | "Draft" | "All";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const result = await getEvents({ status: status ?? "All", page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/public/events]", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}