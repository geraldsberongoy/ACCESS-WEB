"use client";

import { useTransition } from "react";
import { deleteEventAction, togglePublishAction } from "@/features/events/actions/events.actions";
import { Tables } from "@/lib/supabase/database.types";
import Link from "next/link";

type EventRowProps = Pick<Tables<"Events">, "id" | "title" | "event_date" | "status">;

export default function EventRow({ event }: { event: EventRowProps }) {
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = () => {
    startTransition(async () => {
      const result = await togglePublishAction(event.id, event.status ?? "Draft");
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

  const badgeClass =
    event.status === "Published"
      ? "admin-badge admin-badge-published"
      : "admin-badge admin-badge-draft";

  return (
    <tr className={isPending ? "opacity-50" : undefined}>
      <td>
        <div className="font-semibold text-white">{event.title ?? "—"}</div>
      </td>
      <td className="text-white/65">
        {event.event_date ? new Date(event.event_date).toLocaleDateString() : "—"}
      </td>
      <td>
        <span className={badgeClass}>{isPending ? "Updating..." : event.status}</span>
      </td>
      <td className="text-right">
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={isPending}
            className="admin-btn admin-btn-muted"
          >
            {event.status === "Published" ? "Unpublish" : "Publish"}
          </button>
          <Link href={`/admin/events/edit/${event.id}`} className="admin-btn admin-btn-secondary">
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="admin-btn admin-btn-danger"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
