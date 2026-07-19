import { redirect } from "next/navigation";
import {
  AdminAlert,
  AdminCard,
  AdminEmptyState,
  AdminFieldLabel,
  AdminPageHeader,
  AdminPageShell,
  adminBtnDangerClass,
  adminBtnPrimaryClass,
  adminBtnSecondaryClass,
  adminInputClass,
  adminSelectClass,
  adminTextareaClass,
} from "../../components/admin-ui";
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
    <AdminPageShell width="wide">
      <AdminPageHeader
        eyebrow="Site Content"
        title="FAQs"
        description="Manage frequently asked questions on the landing page."
      />

      {params.status && params.message ? (
        <AdminAlert status={params.status} message={params.message} />
      ) : null}

      <AdminCard title="Add FAQ">
        <form action={handleCreate} className="space-y-4">
          <input name="question" placeholder="Question" required className={adminInputClass} />
          <textarea name="answer" placeholder="Answer" required rows={4} className={adminTextareaClass} />
          <input
            name="display_order"
            type="number"
            min={0}
            defaultValue={faqs.length}
            className={`${adminInputClass} sm:max-w-xs`}
          />
          <button type="submit" className={adminBtnPrimaryClass}>
            Add FAQ
          </button>
        </form>
      </AdminCard>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Existing FAQs ({faqs.length})</h3>
        {faqs.length === 0 ? (
          <AdminEmptyState>No FAQs yet. Add your first question above.</AdminEmptyState>
        ) : (
          faqs.map((faq) => (
            <AdminCard key={faq.id}>
              <form action={handleUpdate} className="space-y-3">
                <input type="hidden" name="id" value={faq.id} />
                <input name="question" defaultValue={faq.question} required className={adminInputClass} />
                <textarea name="answer" defaultValue={faq.answer} required rows={4} className={adminTextareaClass} />
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    name="display_order"
                    type="number"
                    min={0}
                    defaultValue={faq.display_order ?? 0}
                    className={`${adminInputClass} w-28`}
                  />
                  <select name="is_active" defaultValue={faq.is_active ? "true" : "false"} className={adminSelectClass}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  <button type="submit" className={adminBtnSecondaryClass}>
                    Save
                  </button>
                </div>
              </form>
              <form action={handleDelete} className="mt-3">
                <input type="hidden" name="id" value={faq.id} />
                <button type="submit" className={adminBtnDangerClass}>
                  Delete
                </button>
              </form>
            </AdminCard>
          ))
        )}
      </section>
    </AdminPageShell>
  );
}
