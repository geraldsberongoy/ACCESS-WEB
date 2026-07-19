import { redirect } from "next/navigation";
import { getAboutContent } from "@/features/cms";
import { updateAboutContentAction } from "@/features/cms/actions/cms.actions";

export const dynamic = "force-dynamic";

export default async function AdminAboutContentPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: "success" | "error"; message?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const about = await getAboutContent();

  async function handleUpdate(formData: FormData) {
    "use server";
    const result = await updateAboutContentAction({ status: "idle" }, formData);

    if (result.status === "error") {
      redirect(
        `/admin/content/about?status=error&message=${encodeURIComponent(result.message)}`
      );
    }

    redirect(
      `/admin/content/about?status=success&message=${encodeURIComponent(
        result.status === "success" ? (result.message ?? "Saved") : "Saved"
      )}`
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h2 className="text-2xl font-semibold">About Us</h2>
          <p className="mt-1 text-sm text-neutral-400">Edit the About Us section text on the landing page.</p>
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

        <form action={handleUpdate} className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
          <div>
            <label className="mb-1.5 block text-sm text-neutral-300">Section title</label>
            <input
              name="title"
              defaultValue={about.title}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-neutral-300">Body text</label>
            <textarea
              name="body"
              defaultValue={about.body}
              rows={8}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
          >
            Save about content
          </button>
        </form>
      </div>
    </div>
  );
}
