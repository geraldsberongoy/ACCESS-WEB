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
  const rosterImage = content.officersImageUrl?.trim() || null;

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
        title="Officers Image"
        description="Upload an image of current ACCESS officers. It appears on the /officers page."
      />

      {params.status && params.message ? (
        <AdminAlert status={params.status} message={params.message} />
      ) : null}

      <AdminCard title="Current officers images">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-zinc-200 mb-2">Batch Officers</h4>
            {content.officersImageUrl ? (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
                <OfficersRosterMedia
                  url={content.officersImageUrl}
                  alt="Part 1"
                  className="h-[min(40vh,400px)] w-full rounded-xl border-0 bg-white object-contain"
                />
              </div>
            ) : (
              <AdminEmptyState>No image uploaded yet.</AdminEmptyState>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-zinc-200 mb-2">ACCESS</h4>
            {content.officersImage2Url ? (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
                <OfficersRosterMedia
                  url={content.officersImage2Url}
                  alt="Part 2"
                  className="h-[min(40vh,400px)] w-full rounded-xl border-0 bg-white object-contain"
                />
              </div>
            ) : (
              <AdminEmptyState>No image uploaded yet.</AdminEmptyState>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-zinc-200 mb-2">Class Representative</h4>
            {content.officersImage3Url ? (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
                <OfficersRosterMedia
                  url={content.officersImage3Url}
                  alt="Part 3"
                  className="h-[min(40vh,400px)] w-full rounded-xl border-0 bg-white object-contain"
                />
              </div>
            ) : (
              <AdminEmptyState>No image uploaded yet.</AdminEmptyState>
            )}
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Upload images">
        <form action={handleUpload} encType="multipart/form-data" className="space-y-5">
          <div className="pt-4 border-t border-white/10 first:border-0 first:pt-0">
            <AdminFieldLabel>Batch Officers</AdminFieldLabel>
            <input
              type="file"
              name="officersImage"
              accept="image/png,image/webp,image/jpeg,image/gif"
              className={adminFileClass}
            />
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <AdminFieldLabel>ACCESS</AdminFieldLabel>
            <input
              type="file"
              name="officersImage2"
              accept="image/png,image/webp,image/jpeg,image/gif"
              className={adminFileClass}
            />
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <AdminFieldLabel>Class Representatives</AdminFieldLabel>
            <input
              type="file"
              name="officersImage3"
              accept="image/png,image/webp,image/jpeg,image/gif"
              className={adminFileClass}
            />
          </div>

          <button type="submit" className={adminBtnPrimaryClass}>
            Save images
          </button>
        </form>
      </AdminCard>
    </AdminPageShell>
  );
}
