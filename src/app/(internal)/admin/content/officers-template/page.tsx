import Image from "next/image";
import { redirect } from "next/navigation";
import { getOfficersSectionContent } from "@/features/cms";
import { updateOfficersSectionAction } from "@/features/cms/actions/cms.actions";

export const dynamic = "force-dynamic";

export default async function AdminOfficersTemplatePage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: "success" | "error"; message?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const content = await getOfficersSectionContent();

  async function handleUpdate(formData: FormData) {
    "use server";
    const result = await updateOfficersSectionAction({ status: "idle" }, formData);

    if (result.status === "error") {
      redirect(
        `/admin/content/officers-template?status=error&message=${encodeURIComponent(result.message)}`
      );
    }

    redirect(
      `/admin/content/officers-template?status=success&message=${encodeURIComponent(
        result.status === "success" ? (result.message ?? "Saved") : "Saved"
      )}`
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h2 className="text-2xl font-semibold">Meet the Officers Template</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Upload the decorative PNG used behind the officers carousel and edit section text.
          </p>
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

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
          <p className="mb-3 text-sm text-neutral-400">Current template preview</p>
          <div className="relative h-40 overflow-hidden rounded-lg border border-neutral-800">
            <Image
              src={content.templateImageUrl}
              alt="Officers section template"
              fill
              className="object-cover"
              unoptimized={content.templateImageUrl.startsWith("http")}
            />
          </div>
        </div>

        <form
          action={handleUpdate}
          encType="multipart/form-data"
          className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5"
        >
          <input type="hidden" name="templateImageUrl" value={content.templateImageUrl} />

          <div>
            <label className="mb-1.5 block text-sm text-neutral-300">Section title</label>
            <input
              name="title"
              defaultValue={content.title}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-neutral-300">Section subtitle</label>
            <textarea
              name="subtitle"
              defaultValue={content.subtitle}
              rows={3}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-neutral-300">Upload new template PNG</label>
            <input
              type="file"
              name="templateImage"
              accept="image/png,image/webp,image/jpeg"
              className="block w-full text-sm text-neutral-300 file:mr-4 file:rounded-md file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-orange-500"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
          >
            Save officers section
          </button>
        </form>
      </div>
    </div>
  );
}
