'use server'

import { revalidatePath } from 'next/cache';
import { publishEventById, unpublishEventById, deleteEventById } from '../services/events.admin.service';

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