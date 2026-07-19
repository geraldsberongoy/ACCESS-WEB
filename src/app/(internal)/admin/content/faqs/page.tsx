import { redirect } from "next/navigation";
import { getAllFAQsForAdmin } from "@/features/cms";
import {
  createFAQAction,
  deleteFAQAction,
  updateFAQAction,
} from "@/features/cms/actions/cms.actions";

export const dynamic = "force-dynamic";

export default async function AdminFAQsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: "success" | "error"; message?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const faqs = await getAllFAQsForAdmin();

  async function handleCreate(formData: FormData) {
    "use server";
    const result = await createFAQAction({ status: "idle" }, formData);

    if (result.status === "error") {
      redirect(`/admin/content/faqs?status=error&message=${encodeURIComponent(result.message)}`);
    }

    redirect(
      `/admin/content/faqs?status=success&message=${encodeURIComponent(
        result.status === "success" ? (result.message ?? "FAQ created") : "FAQ created"
      )}`
    );
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    const result = await updateFAQAction({ status: "idle" }, formData);

    if (result.status === "error") {
      redirect(`/admin/content/faqs?status=error&message=${encodeURIComponent(result.message)}`);
    }

    redirect(
      `/admin/content/faqs?status=success&message=${encodeURIComponent(
        result.status === "success" ? (result.message ?? "FAQ updated") : "FAQ updated"
      )}`
    );
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id");
    if (typeof id !== "string") {
      redirect("/admin/content/faqs?status=error&message=FAQ%20ID%20required");
    }

    const result = await deleteFAQAction({ status: "idle" }, id);

    if (result.status === "error") {
      redirect(`/admin/content/faqs?status=error&message=${encodeURIComponent(result.message)}`);
    }

    redirect(
      `/admin/content/faqs?status=success&message=${encodeURIComponent(
        result.status === "success" ? (result.message ?? "FAQ deleted") : "FAQ deleted"
      )}`
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header>
          <h2 className="text-2xl font-semibold">FAQs</h2>
          <p className="mt-1 text-sm text-neutral-400">Manage frequently asked questions on the landing page.</p>
        </header>

        {params.status && params.message ? (
          <div
            className={
              params.status === "success"
                ? "rounded-lg border border-emerald-700/60 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200"
                : "rounded-lg border border-rose-700/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-200"
            }
          >
            {params.message}
          </div>
        ) : null}

        <section className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
          <h3 className="mb-4 text-lg font-medium">Add FAQ</h3>
          <form action={handleCreate} className="space-y-4">
            <input
              name="question"
              placeholder="Question"
              required
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
            <textarea
              name="answer"
              placeholder="Answer"
              required
              rows={4}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
            <input
              name="display_order"
              type="number"
              min={0}
              defaultValue={faqs.length}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2 sm:max-w-xs"
            />
            <button
              type="submit"
              className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
            >
              Add FAQ
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Existing FAQs ({faqs.length})</h3>
          {faqs.map((faq) => (
            <article
              key={faq.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5"
            >
              <form action={handleUpdate} className="space-y-3">
                <input type="hidden" name="id" value={faq.id} />
                <input
                  name="question"
                  defaultValue={faq.question}
                  required
                  className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                />
                <textarea
                  name="answer"
                  defaultValue={faq.answer}
                  required
                  rows={4}
                  className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    name="display_order"
                    type="number"
                    min={0}
                    defaultValue={faq.display_order ?? 0}
                    className="w-28 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                  />
                  <select
                    name="is_active"
                    defaultValue={faq.is_active ? "true" : "false"}
                    className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
                  >
                    Save
                  </button>
                </div>
              </form>

              <form action={handleDelete} className="mt-3">
                <input type="hidden" name="id" value={faq.id} />
                <button
                  type="submit"
                  className="rounded-md bg-rose-700 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
                >
                  Delete
                </button>
              </form>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
