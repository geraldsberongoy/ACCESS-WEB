'use server'

import { revalidatePath } from 'next/cache';
import { publishEventById, unpublishEventById, deleteEventById, postEvent, editEvent, uploadEventImage } from '../services/events.admin.service';

export async function togglePublishAction(id: string, currentStatus: 'Published' | 'Draft') {
  try {
    if (currentStatus === 'Published') {
      await unpublishEventById(id);
    } else {
      await publishEventById(id);
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
    await deleteEventById(id);
    
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
    let image_url: string | undefined;

    if (image && image.size > 0) {
      image_url = await uploadEventImage(image);
    }

    await postEvent({
      title: formData.get("title") as string,
      content_description: formData.get("content_description") as string,
      event_date: (formData.get("event_date") as string) || undefined,
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
    const image = formData.get("image") as File | null;
    let image_url: string | undefined;

    if (image && image.size > 0) {
      image_url = await uploadEventImage(image);
    }

    await editEvent(id, {
      title: formData.get("title") as string,
      content_description: formData.get("content_description") as string,
      event_date: (formData.get("event_date") as string) || undefined,
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