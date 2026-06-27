'use server'

import { revalidatePath } from 'next/cache';
import { publishEventById, unpublishEventById, deleteEventById, postEvent, editEvent, uploadEventImage } from '../services/events.admin.service';
import { EventIdSchema } from '../schemas';

export async function togglePublishAction(id: string, currentStatus: 'Published' | 'Draft') {
  try {
    const validationResult = EventIdSchema.safeParse(id);

    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0]?.message ?? "Invalid event ID" };
    }

    if (currentStatus === 'Published') {
      await unpublishEventById(validationResult.data);
    } else {
      await publishEventById(validationResult.data);
    }

    // Tells Next.js to remove cache for the dashboard and fetch fresh data from DB
    revalidatePath('/admin/events');
    
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle status:", error);
    return { success: false, error: "Update failed" };
  }
}

export async function deleteEventAction(id: string) {
  try {
    const validationResult = EventIdSchema.safeParse(id);

    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0]?.message ?? "Invalid event ID" };
    }

    await deleteEventById(validationResult.data);
    
    // Refresh the list so the deleted item disappears
    revalidatePath('/admin/events');
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, error: "Deletion failed" };
  }
}

export async function createEventAction(formData: FormData) {
  try {
    const image = formData.get("image") as File | null;
    const image_url = image && image.size > 0 ? await uploadEventImage(image) : undefined;

    await postEvent({
      title: String(formData.get("title") ?? ""),
      content_description: String(formData.get("content_description") ?? ""),
      event_date: String(formData.get("event_date") ?? "") || undefined,
      status: (formData.get("status") as "Draft" | "Published") ?? "Draft",
      image_url,
    });

    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    console.error("[createEventAction]", error);
    return { success: false, error: "Failed to create event" + error};
  }
}

export async function editEventAction(id: string, formData: FormData) {
  try {
    const idValidationResult = EventIdSchema.safeParse(id);

    if (!idValidationResult.success) {
      return { success: false, error: idValidationResult.error.issues[0]?.message ?? "Invalid event ID" };
    }

    const image = formData.get("image") as File | null;
    const image_url = image && image.size > 0 ? await uploadEventImage(image) : undefined;

    await editEvent(idValidationResult.data, {
      title: String(formData.get("title") ?? ""),
      content_description: String(formData.get("content_description") ?? ""),
      event_date: String(formData.get("event_date") ?? "") || undefined,
      status: (formData.get("status") as "Draft" | "Published") ?? "Draft",
      ...(image_url && { image_url }),
    });

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/edit/${id}`);
    return { success: true };
  } catch (error) {
    console.error("[editEventAction]", error);
    return { success: false, error: "Failed to update event" };
  }
}