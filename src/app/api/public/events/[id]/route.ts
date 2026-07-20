import { NextResponse, type NextRequest } from "next/server";
import { getPublishedEventById } from "@/features/events/services/events.public.service";
import { EventIdSchema } from "@/features/events/schemas";
import { toErrorResponse } from "@/lib/errors";


export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const validationResult = EventIdSchema.safeParse(id);

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0]?.message ?? "Invalid event ID" }, { status: 400 });
    }

    const event = await getPublishedEventById(validationResult.data);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    console.error("[GET /api/public/events/:id]", error);
    return toErrorResponse(error);
  }
}