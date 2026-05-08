import { createOfficerAction } from "@/features/officers/actions/officers.actions";
import Link from "next/link";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams?: Promise<{
    feedback?: "success" | "error";
    message?: string;
  }>;
};

export default async function AdminAddOfficerPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const feedback = params.feedback;
  const message = params.message;

  async function handleCreate(formData: FormData) {
    "use server";
    const result = await createOfficerAction({ status: "idle" }, formData);

    if (result.status === "error") {
      redirect(
        `/admin/officers/new?feedback=error&message=${encodeURIComponent(result.message)}`
      );
    }

    redirect("/admin/officers?feedback=success&message=Officer%20created%20successfully");
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-8 text-neutral-100 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Add Officer</h1>
            <p className="text-sm text-neutral-400">Create a new officer record.</p>
          </div>
          <Link
            href="/admin/officers"
            className="rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
          >
            Back to Officers
          </Link>
        </div>

        {feedback && message ? (
          <section
            className={
              feedback === "success"
                ? "rounded-lg border border-emerald-700/60 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200"
                : "rounded-lg border border-rose-700/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-200"
            }
          >
            {message}
          </section>
        ) : null}

        <section className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
          <form action={handleCreate} className="grid gap-3 sm:grid-cols-2">
            <input
              name="full_name"
              placeholder="Full name"
              required
              className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
            <input
              name="position_title"
              placeholder="Position title"
              required
              className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
            <input
              name="department"
              placeholder="Department"
              required
              className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
            <input
              name="academic_year"
              placeholder="2025-2026"
              required
              className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
            <input
              name="image_url"
              placeholder="https://..."
              className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
            <input
              name="display_order"
              type="number"
              min={0}
              placeholder="Display order (optional)"
              className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            />
            <select
              name="is_active"
              defaultValue="true"
              className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-500"
              >
                Create Officer
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
