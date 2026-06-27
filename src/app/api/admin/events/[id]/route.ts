import { NextResponse, type NextRequest } from "next/server";
import { deleteEventById, editEvent } from "@/features/events/services/events.admin.service";
import { EventIdSchema } from "@/features/events/schemas";
import { toErrorResponse } from "@/lib/errors";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const validationResult = EventIdSchema.safeParse(id);

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0]?.message ?? "Invalid event ID" }, { status: 400 });
    }

    const event = await deleteEventById(validationResult.data);
    return NextResponse.json(event);
  } catch (error) {
    console.error("[GET /api/admin/events/:id]", error);
    return toErrorResponse(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const result = await editEvent(id, {
      title: body.title,
      content_description: body.content_description,
      event_date: body.event_date,
      status: body.status,
      image_url: body.image_url,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[PUT /api/admin/events/:id]", error);
    return toErrorResponse(error);
  }
}