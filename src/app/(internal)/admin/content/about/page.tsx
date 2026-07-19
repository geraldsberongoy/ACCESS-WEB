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
      redirect(`/admin/content/about?status=error&message=${encodeURIComponent(result.message)}`);
    }

    redirect(
      `/admin/content/about?status=success&message=${encodeURIComponent(
        result.status === "success" ? (result.message ?? "Saved") : "Saved"
      )}`
    );
  }

  return (
    <AdminPageShell width="narrow">
      <AdminPageHeader
        eyebrow="Site Content"
        title="About Us"
        description="Edit the About Us section text on the landing page."
      />

      {params.status && params.message ? (
        <AdminAlert status={params.status} message={params.message} />
      ) : null}

      <AdminCard title="About section">
        <form action={handleUpdate} className="space-y-5">
          <div>
            <AdminFieldLabel>Section title</AdminFieldLabel>
            <input name="title" defaultValue={about.title} className={adminInputClass} />
          </div>
          <div>
            <AdminFieldLabel>Body text</AdminFieldLabel>
            <textarea name="body" defaultValue={about.body} rows={8} className={adminTextareaClass} />
          </div>
          <button type="submit" className={adminBtnPrimaryClass}>
            Save about content
          </button>
        </form>
      </AdminCard>
    </AdminPageShell>
  );
}
