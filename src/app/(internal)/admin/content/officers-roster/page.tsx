import { redirect } from "next/navigation";
import OfficersRosterMedia from "@/features/cms/components/OfficersRosterMedia";
import {
  AdminAlert,
  AdminCard,
  AdminEmptyState,
  AdminFieldLabel,
  AdminPageHeader,
  AdminPageShell,
  adminBtnPrimaryClass,
  adminFileClass,
} from "../../components/admin-ui";
import { getOfficersSectionContent } from "@/features/cms";
import { updateOfficersRosterAction } from "@/features/cms/actions/cms.actions";

export const dynamic = "force-dynamic";

export default async function AdminOfficersRosterPage({
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
        `/admin/content/officers-roster?status=error&message=${encodeURIComponent(result.message)}`
      );
    }

    redirect(
      `/admin/content/officers-roster?status=success&message=${encodeURIComponent(
        result.status === "success" ? (result.message ?? "Saved") : "Saved"
      )}`
    );
  }

  return (
    <AdminPageShell width="narrow">
      <AdminPageHeader
        eyebrow="Site Content"
        title="Officers File"
        description="Upload an image or PDF of current ACCESS officers. It appears on the /officers page."
      />

      {params.status && params.message ? (
        <AdminAlert status={params.status} message={params.message} />
      ) : null}

      <AdminCard title="Current officers file">
        {rosterPreview ? (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
            <OfficersRosterMedia
              url={rosterPreview}
              alt="Current officers roster"
              frameClassName="h-[min(70vh,800px)] w-full rounded-xl border-0 bg-white"
            />
          </div>
        ) : (
          <AdminEmptyState>No officers file uploaded yet.</AdminEmptyState>
        )}
      </AdminCard>

      <AdminCard title="Upload file">
        <form action={handleUpload} encType="multipart/form-data" className="space-y-5">
          <div>
            <AdminFieldLabel>Officers file</AdminFieldLabel>
            <input
              type="file"
              name="officersImage"
              accept="image/png,image/webp,image/jpeg,application/pdf,.pdf"
              required={!rosterPreview}
              className={adminFileClass}
            />
            <p className="admin-help-text">PNG, JPG, WEBP, or PDF. One file showing all current officers.</p>
          </div>
          <button type="submit" className={adminBtnPrimaryClass}>
            Save officers file
          </button>
        </form>
      </AdminCard>
    </AdminPageShell>
  );
}
