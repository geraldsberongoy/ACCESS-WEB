import {
  deactivateOfficerAction,
  updateOfficerAction,
} from "@/features/officers/actions/officers.actions";
import { getOfficersForAdmin } from "@/features/officers/services/officers.admin.service";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    feedback?: "success" | "error";
    message?: string;
    page?: string;
    status?: "All" | "Active" | "Inactive";
    q?: string;
  }>;
};

export default async function AdminOfficersPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const feedback = params.feedback;
  const message = params.message;
  const currentPage = Number(params.page) || 1;
  const currentStatus = params.status ?? "All";
  const currentQuery = params.q?.trim() ?? "";

  // Step 1: Load paginated officers with filters from the service layer.
  const { data: officers, meta } = await getOfficersForAdmin({
    page: currentPage,
    limit: 10,
    status: currentStatus,
    search: currentQuery,
  });

  // Step 1.1: Detect current user's role to explain RLS failures.
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentRole: string | null = null;
  if (user?.id) {
    const { data: userRow } = await supabase
      .from("Users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    currentRole = userRow?.role ?? null;
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    const result = await updateOfficerAction({ status: "idle" }, formData);

    if (result.status === "error") {
      redirect(
        `/admin/officers?feedback=error&message=${encodeURIComponent(result.message)}`
      );
    }

    redirect("/admin/officers?feedback=success&message=Officer%20updated%20successfully");
  }

  async function handleDeactivate(formData: FormData) {
    "use server";
    const id = formData.get("id");
    if (typeof id === "string" && id.length > 0) {
      const result = await deactivateOfficerAction({ status: "idle" }, id);

      if (result.status === "error") {
        redirect(
          `/admin/officers?feedback=error&message=${encodeURIComponent(result.message)}`
        );
      }

      redirect("/admin/officers?feedback=success&message=Officer%20deactivated%20successfully");
    }

    redirect("/admin/officers?feedback=error&message=Officer%20ID%20is%20required");
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-8 text-neutral-100 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Officers Admin</h1>
          <p className="text-sm text-neutral-400">
            Manage officers record.
          </p>
        </header>

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

        {currentRole !== "Admin" ? (
          <section className="rounded-lg border border-amber-700/60 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
            Your current role is <strong>{currentRole ?? "Unknown"}</strong>. Officers create/update is blocked by
            RLS unless role is <strong>Admin</strong> in the <strong>public.Users</strong> table.
          </section>
        ) : null}

        <section className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-medium">Officers ({meta.total})</h2>
            <Link
              href="/admin/officers/new"
              className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-500"
            >
              Add Officer
            </Link>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            {(["All", "Active", "Inactive"] as const).map((option) => (
              <Link
                key={option}
                href={`?status=${option}&page=1&q=${encodeURIComponent(currentQuery)}`}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  currentStatus === option
                    ? "bg-sky-600 text-white"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                {option}
              </Link>
            ))}
          </div>

          <form className="mb-5 flex items-center gap-2" method="get">
            <input type="hidden" name="status" value={currentStatus} />
            <input
              type="hidden"
              name="page"
              value="1"
            />
            <input
              name="q"
              defaultValue={currentQuery}
              placeholder="Search name, email, position, department"
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
            />
            <button
              type="submit"
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
            >
              Filter
            </button>
          </form>

          {/*
            Step 4: Render one update form per officer.
            - Save button calls update action
            - Deactivate button calls deactivate action (soft delete)
          */}
          <div className="space-y-4">
            {officers.map((officer) => (
              <article key={officer.id} className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
                <form action={handleUpdate} className="grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="id" value={officer.id} />

                  <input
                    name="full_name"
                    defaultValue={officer.full_name ?? ""}
                    required
                    className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                  />
                  <input
                    name="email"
                    type="email"
                    defaultValue={officer.email ?? ""}
                    required
                    className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                  />
                  <input
                    name="position_title"
                    defaultValue={officer.position_title ?? ""}
                    required
                    className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                  />
                  <input
                    name="department"
                    defaultValue={officer.department ?? ""}
                    required
                    className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                  />
                  <input
                    name="academic_year"
                    defaultValue={officer.academic_year ?? ""}
                    required
                    className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                  />
                  <input
                    name="image_url"
                    defaultValue={officer.image_url ?? ""}
                    className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                  />
                  <input
                    name="display_order"
                    type="number"
                    min={0}
                    defaultValue={officer.display_order ?? 0}
                    className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                  />
                  <select
                    name="is_active"
                    defaultValue={officer.is_active ? "true" : "false"}
                    className="rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>

                  <div className="sm:col-span-2 flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>

                <form action={handleDeactivate} className="mt-2">
                  <input type="hidden" name="id" value={officer.id} />
                  <button
                    type="submit"
                    className="rounded-md bg-rose-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
                  >
                    Deactivate (Soft Delete)
                  </button>
                </form>
              </article>
            ))}

            {officers.length === 0 ? (
              <article className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">
                No officers found for this filter.
              </article>
            ) : null}
          </div>

          {meta.totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-between gap-3 text-sm text-neutral-400">
              <p>
                Showing {(currentPage - 1) * meta.limit + 1}-{Math.min(currentPage * meta.limit, meta.total)} of {meta.total}
              </p>
              <div className="flex gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={`?status=${currentStatus}&q=${encodeURIComponent(currentQuery)}&page=${currentPage - 1}`}
                    className="rounded-md border border-neutral-700 px-3 py-2 text-neutral-200 hover:bg-neutral-800"
                  >
                    Previous
                  </Link>
                ) : null}
                {currentPage < meta.totalPages ? (
                  <Link
                    href={`?status=${currentStatus}&q=${encodeURIComponent(currentQuery)}&page=${currentPage + 1}`}
                    className="rounded-md bg-sky-600 px-3 py-2 text-white hover:bg-sky-500"
                  >
                    Next
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}