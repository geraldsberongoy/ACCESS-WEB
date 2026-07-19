import { redirect } from "next/navigation";
import { getHeroContent } from "@/features/cms";
import { updateHeroContentAction } from "@/features/cms/actions/cms.actions";

export const dynamic = "force-dynamic";

export default async function AdminLandingContentPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: "success" | "error"; message?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const hero = await getHeroContent();

  async function handleUpdate(formData: FormData) {
    "use server";
    const result = await updateHeroContentAction({ status: "idle" }, formData);

    if (result.status === "error") {
      redirect(
        `/admin/content/landing?status=error&message=${encodeURIComponent(result.message)}`
      );
    }

    redirect(
      `/admin/content/landing?status=success&message=${encodeURIComponent(
        result.status === "success" ? (result.message ?? "Saved") : "Saved"
      )}`
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h2 className="text-2xl font-semibold">Landing Content</h2>
          <p className="mt-1 text-sm text-neutral-400">Edit the hero section on the homepage.</p>
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
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <label className="mb-1.5 block text-sm text-neutral-300">
                Title line {index + 1}
              </label>
              <input
                name={`titleLine${index + 1}`}
                defaultValue={hero.titleLines[index] ?? ""}
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
              />
            </div>
          ))}

          <div>
            <label className="mb-1.5 block text-sm text-neutral-300">Subtitle</label>
            <textarea
              name="subtitle"
              defaultValue={hero.subtitle}
              rows={4}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-neutral-300">Primary CTA label</label>
              <input
                name="primaryCtaLabel"
                defaultValue={hero.primaryCtaLabel}
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-neutral-300">Secondary CTA label</label>
              <input
                name="secondaryCtaLabel"
                defaultValue={hero.secondaryCtaLabel}
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
          >
            Save landing content
          </button>
        </form>
      </div>
    </div>
  );
}
