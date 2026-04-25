import { NextResponse, type NextRequest } from "next/server";
import { getEventById } from "@/features/events/services/events.service";


export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const event = await getEventById(params.id);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    console.error("[GET /api/public/events/:id]", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}