"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { editEventAction } from "@/features/events/actions/events.actions";
import { Tables } from "@/lib/supabase/database.types";
import {
  AdminCard,
  AdminFieldLabel,
  adminBtnPrimaryClass,
  adminBtnSecondaryClass,
  adminFileClass,
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/app/(internal)/admin/components/admin-ui";

type EditEventFormProps = {
  event: Pick<
    Tables<"Events">,
    "id" | "title" | "content_description" | "event_date" | "status" | "image_url"
  >;
};

export default function EditEventForm({ event }: EditEventFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await editEventAction(event.id, formData);
      if (result.success) {
        router.push("/admin/events");
      } else {
        alert(result.error);
      }
    });
  };

  const formattedDate = event.event_date
    ? new Date(event.event_date).toISOString().slice(0, 16)
    : "";

  return (
    <AdminCard title="Event details">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <AdminFieldLabel>Title</AdminFieldLabel>
          <input
            name="title"
            type="text"
            required
            defaultValue={event.title ?? ""}
            disabled={isPending}
            className={adminInputClass}
          />
        </div>

        <div>
          <AdminFieldLabel>Description</AdminFieldLabel>
          <textarea
            name="content_description"
            rows={5}
            required
            defaultValue={event.content_description ?? ""}
            disabled={isPending}
            className={adminTextareaClass}
          />
        </div>

        <div>
          <AdminFieldLabel>Event date</AdminFieldLabel>
          <input
            name="event_date"
            type="datetime-local"
            defaultValue={formattedDate}
            disabled={isPending}
            className={`${adminInputClass} [color-scheme:dark]`}
          />
        </div>

        <div>
          <AdminFieldLabel>Status</AdminFieldLabel>
          <select
            name="status"
            defaultValue={event.status ?? "Draft"}
            disabled={isPending}
            className={adminSelectClass}
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>

        <div>
          <AdminFieldLabel>Image</AdminFieldLabel>
          {event.image_url && (
            <Image
              src={event.image_url}
              alt="Current event image"
              width={160}
              height={96}
              className="mb-3 rounded-xl border border-white/10 object-cover"
            />
          )}
          <input name="image" type="file" accept="image/*" disabled={isPending} className={adminFileClass} />
          <p className="admin-help-text">Leave empty to keep the current image.</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/admin/events")}
            disabled={isPending}
            className={adminBtnSecondaryClass}
          >
            Cancel
          </button>
          <button type="submit" disabled={isPending} className={adminBtnPrimaryClass}>
            {isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </AdminCard>
  );
}
