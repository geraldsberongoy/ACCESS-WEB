import { NextResponse, type NextRequest } from "next/server";
import { getEventsForAdmin, postEvent } from "@/features/events/services/events.admin.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") as "Published" | "Draft" | "All";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const result = await getEventsForAdmin({ status: status ?? "All", page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/admin/events/:id]", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const status: "Draft" | "Published" = body.status === "Published" ? "Published" : "Draft";

    const result = await postEvent({
      title: body.title ?? "",
      content_description: body.content_description ?? "",
      event_date: body.event_date,
      status,
      image_url: body.image_url,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[POST /api/admin/events]", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}