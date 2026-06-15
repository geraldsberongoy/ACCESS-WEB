"use client";

import { useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { createEventAction } from "@/features/events/actions/events.actions";

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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          name="title"
          type="text"
          required
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
          disabled={isPending}
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Event Date</label>
        <input
          name="event_date"
          type="datetime-local"
          disabled={isPending}
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <select
          name="status"
          defaultValue="Draft"
          disabled={isPending}
          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
        <input
          name="image"
          type="file"
          accept="image/*"
          disabled={isPending}
          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
        />
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
          {isPending ? "Creating..." : "Create Event"}
        </button>
      </div>
    </form>
  );
}