"use client";

import { useTransition } from 'react';
import { deleteEventAction, togglePublishAction } from "@/features/events/actions/events.actions";
import { Tables } from '@/lib/supabase/database.types';
import Link from 'next/link';

type EventRowProps = Pick<Tables<'Events'>, 'id' | 'title' | 'event_date' | 'status'>;

export default function EventRow({ event }: { event: EventRowProps }) {
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = () => {
    // startTransition keeps the UI responsive while the server works
    startTransition(async () => {
      const result = await togglePublishAction(event.id, event.status ?? 'Draft');
      if (!result.success) {
        alert("Something went wrong!");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteEventAction(event.id);
      if (!result.success) {
        alert("Failed to delete event.");
      }
    });
  };

  return (
    <tr className={`group hover:bg-slate-50 transition-colors ${isPending ? 'opacity-50' : ''}`}>
      <td className="px-6 py-4">
        <div className="font-semibold text-slate-800">{event.title ?? '—'}</div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600">
        {event.event_date ? new Date(event.event_date).toLocaleDateString() : '—'}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
          event.status === 'Published' 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-amber-100 text-amber-700'
        }`}>
          {isPending ? 'Updating...' : event.status}
        </span>
      </td>

      <td className="px-6 py-4 text-right space-x-3">
        <button 
          onClick={handleToggleStatus}
          disabled={isPending}
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 uppercase transition-colors disabled:cursor-not-allowed"
        >
          {event.status === 'Published' ? 'Unpublish' : 'Publish'}
        </button>
        <Link
          href={`/admin/events/edit/${event.id}`}
          className="text-xs font-bold text-slate-500 hover:text-blue-600 uppercase transition-colors"
        >
          Edit
        </Link>
        <button 
          onClick={handleDelete}
          disabled={isPending}
          className="text-xs font-bold text-slate-400 hover:text-red-600 uppercase transition-colors disabled:cursor-not-allowed"
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </button>
      </td>
    </tr>
  );
}