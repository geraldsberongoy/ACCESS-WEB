import { NextResponse, type NextRequest } from "next/server";
import { getPublishedEventById } from "@/features/events/services/events.public.service";


export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = await getPublishedEventById(id);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    console.error("[GET /api/public/events/:id]", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}