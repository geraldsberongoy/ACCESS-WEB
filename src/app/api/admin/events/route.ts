import { NextResponse, type NextRequest } from "next/server";
import { getEventsForAdmin, postEvent } from "@/features/events/services/events.admin.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const result = await getEventsForAdmin({
      status: searchParams.get("status") as "Published" | "Draft" | "All" | null ?? undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/admin/events/:id]", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await postEvent({
      title: body.title,
      content_description: body.content_description,
      event_date: body.event_date,
      status: body.status,
      image_url: body.image_url,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[POST /api/admin/events]", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}