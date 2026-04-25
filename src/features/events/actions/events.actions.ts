'use server'

import { revalidatePath } from 'next/cache';
import { publishEventById, unpublishEventById } from '../services/events.service';

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