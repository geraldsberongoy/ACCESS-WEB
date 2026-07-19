import { redirect } from "next/navigation";
import {
  AdminAlert,
  AdminCard,
  AdminFieldLabel,
  AdminPageHeader,
  AdminPageShell,
  adminBtnPrimaryClass,
  adminInputClass,
  adminTextareaClass,
} from "../../components/admin-ui";
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
    <AdminPageShell width="narrow">
      <AdminPageHeader
        eyebrow="Site Content"
        title="Landing Content"
        description="Edit the hero section on the homepage."
      />

      {params.status && params.message ? (
        <AdminAlert status={params.status} message={params.message} />
      ) : null}

      <AdminCard title="Hero section">
        <form action={handleUpdate} className="space-y-5">
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <AdminFieldLabel>Title line {index + 1}</AdminFieldLabel>
              <input
                name={`titleLine${index + 1}`}
                defaultValue={hero.titleLines[index] ?? ""}
                className={adminInputClass}
              />
            </div>
          ))}

          <div>
            <AdminFieldLabel>Subtitle</AdminFieldLabel>
            <textarea name="subtitle" defaultValue={hero.subtitle} rows={4} className={adminTextareaClass} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <AdminFieldLabel>Primary CTA label</AdminFieldLabel>
              <input name="primaryCtaLabel" defaultValue={hero.primaryCtaLabel} className={adminInputClass} />
            </div>
            <div>
              <AdminFieldLabel>Secondary CTA label</AdminFieldLabel>
              <input name="secondaryCtaLabel" defaultValue={hero.secondaryCtaLabel} className={adminInputClass} />
            </div>
          </div>

          <button type="submit" className={adminBtnPrimaryClass}>
            Save landing content
          </button>
        </form>
      </AdminCard>
    </AdminPageShell>
  );
}
