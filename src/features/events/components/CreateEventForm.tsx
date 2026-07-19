"use client";

import { useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { createEventAction } from "@/features/events/actions/events.actions";
import {
  AdminCard,
  AdminFieldLabel,
  AdminPageHeader,
  AdminPageShell,
  adminBtnPrimaryClass,
  adminBtnSecondaryClass,
  adminFileClass,
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "@/app/(internal)/admin/components/admin-ui";

export default function CreateEventForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createEventAction(formData);
      if (result.success) {
        router.push("/admin/events");
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <AdminPageShell width="narrow">
      <AdminPageHeader
        eyebrow="Operations"
        title="New Event"
        description="Create a new event for the public events page."
      />

      <AdminCard title="Event details">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <div>
            <AdminFieldLabel>Title</AdminFieldLabel>
            <input name="title" type="text" required disabled={isPending} className={adminInputClass} />
          </div>

          <div>
            <AdminFieldLabel>Description</AdminFieldLabel>
            <textarea
              name="content_description"
              rows={5}
              required
              disabled={isPending}
              className={adminTextareaClass}
            />
          </div>

          <div>
            <AdminFieldLabel>Event date</AdminFieldLabel>
            <input
              name="event_date"
              type="datetime-local"
              disabled={isPending}
              className={`${adminInputClass} [color-scheme:dark]`}
            />
          </div>

          <div>
            <AdminFieldLabel>Status</AdminFieldLabel>
            <select name="status" defaultValue="Draft" disabled={isPending} className={adminSelectClass}>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <div>
            <AdminFieldLabel>Image</AdminFieldLabel>
            <input name="image" type="file" accept="image/*" disabled={isPending} className={adminFileClass} />
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
              {isPending ? "Creating..." : "Create event"}
            </button>
          </div>
        </form>
      </AdminCard>
    </AdminPageShell>
  );
}
