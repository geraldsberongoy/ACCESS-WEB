import { getContactMessagesForAdmin } from "@/features/cms";
import { markContactMessageReadAction } from "@/features/cms/actions/cms.actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default async function AdminContactMessagesPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: "success" | "error"; message?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const messages = await getContactMessagesForAdmin();

  async function handleMarkRead(formData: FormData) {
    "use server";
    const id = formData.get("id");
    if (typeof id !== "string") {
      redirect("/admin/contact-messages?status=error&message=Message%20ID%20required");
    }

    const result = await markContactMessageReadAction(id);

    if (result.status === "error") {
      redirect(
        `/admin/contact-messages?status=error&message=${encodeURIComponent(result.message)}`
      );
    }

    redirect("/admin/contact-messages?status=success&message=Marked%20as%20read");
  }

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <h2 className="text-2xl font-semibold">Contact Messages</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Messages submitted through the Contact Us form on the landing page.
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

        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-sm text-neutral-500">No contact messages yet.</p>
          ) : (
            messages.map((message) => (
              <article
                key={message.id}
                className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-white">{message.full_name}</h3>
                      {!message.is_read && (
                        <span className="rounded-full bg-orange-600/20 px-2 py-0.5 text-xs text-orange-300">
                          Unread
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-400">{message.email}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {formatDate(message.created_at)}
                    </p>
                  </div>

                  {!message.is_read && (
                    <form action={handleMarkRead}>
                      <input type="hidden" name="id" value={message.id} />
                      <button
                        type="submit"
                        className="rounded-md bg-neutral-800 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-700"
                      >
                        Mark as read
                      </button>
                    </form>
                  )}
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-neutral-500">Course / Year / Section</dt>
                    <dd className="text-neutral-200">{message.course_year_section ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Contact number</dt>
                    <dd className="text-neutral-200">{message.contact_number ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Organization</dt>
                    <dd className="text-neutral-200">{message.organization ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-neutral-500">Purpose</dt>
                    <dd className="text-neutral-200">{message.purpose ?? "—"}</dd>
                  </div>
                </dl>

                <div className="mt-4">
                  <p className="text-sm text-neutral-500">Concern</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-200">
                    {message.concern}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
