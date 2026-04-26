"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { editEventAction } from "@/features/events/actions/events.actions";
import { Tables } from "@/lib/supabase/database.types";
import Image from "next/image";

type EditEventFormProps = {
  event: Pick<Tables<"Events">, "id" | "title" | "content_description" | "event_date" | "status" | "image_url">;
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

  // Format for datetime-local input (YYYY-MM-DDTHH:mm)
  const formattedDate = event.event_date
    ? new Date(event.event_date).toISOString().slice(0, 16)
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          name="title"
          type="text"
          required
          defaultValue={event.title ?? ""}
          disabled={isPending}
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          name="content_description"
          rows={5}
          required
          defaultValue={event.content_description ?? ""}
          disabled={isPending}
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Event Date</label>
        <input
          name="event_date"
          type="datetime-local"
          defaultValue={formattedDate}
          disabled={isPending}
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <select
          name="status"
          defaultValue={event.status ?? "Draft"}
          disabled={isPending}
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
        {event.image_url && (
          <Image
            src={event.image_url}
            alt="Current event image"
            width={160}
            height={96}
            className="object-cover rounded-lg mb-2 border border-slate-200"
          />
        )}
        <input
          name="image"
          type="file"
          accept="image/*"
          disabled={isPending}
          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
        />
        <p className="text-xs text-slate-400 mt-1">Leave empty to keep the current image.</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          disabled={isPending}
          className="px-5 py-2.5 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}