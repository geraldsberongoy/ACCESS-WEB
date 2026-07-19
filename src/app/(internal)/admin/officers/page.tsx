import Image from "next/image";
import { redirect } from "next/navigation";
import { getOfficersSectionContent } from "@/features/cms";
import { updateOfficersRosterAction } from "@/features/cms/actions/cms.actions";

export const dynamic = "force-dynamic";

export default async function AdminOfficersPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: "success" | "error"; message?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const content = await getOfficersSectionContent();
  const rosterPreview = content.officersImageUrl || null;

  async function handleUpload(formData: FormData) {
    "use server";
    const result = await updateOfficersRosterAction({ status: "idle" }, formData);

    if (result.status === "error") {
      redirect(
        `/admin/officers?status=error&message=${encodeURIComponent(result.message)}`
      );
    }

    redirect(
      `/admin/officers?status=success&message=${encodeURIComponent(
        result.status === "success" ? (result.message ?? "Saved") : "Saved"
      )}`
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h2 className="text-2xl font-semibold">Officers</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Upload a single image showing the current ACCESS officers. This image is shown on the
            landing page and the officers page.
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

        <section className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
          <p className="mb-3 text-sm text-neutral-400">Current officers image</p>
          {rosterPreview ? (
            <div className="relative min-h-[280px] overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
              <Image
                src={rosterPreview}
                alt="Current officers roster"
                width={1200}
                height={800}
                className="h-auto w-full object-contain"
                unoptimized={rosterPreview.startsWith("http")}
              />
            </div>
          ) : (
            <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-neutral-700 bg-neutral-950 text-sm text-neutral-500">
              No officers image uploaded yet.
            </div>
          )}
        </section>

        <form
          action={handleUpload}
          encType="multipart/form-data"
          className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5"
        >
          <div>
            <label className="mb-1.5 block text-sm text-neutral-300">
              Upload officers image
            </label>
            <input
              type="file"
              name="officersImage"
              accept="image/png,image/webp,image/jpeg"
              required={!rosterPreview}
              className="block w-full text-sm text-neutral-300 file:mr-4 file:rounded-md file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-orange-500"
            />
            <p className="mt-2 text-xs text-neutral-500">
              PNG, JPG, or WEBP. Use one image that shows all current officers.
            </p>
          </div>

          <button
            type="submit"
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
          >
            Save officers image
          </button>
        </form>
      </div>
    </div>
  );
}
