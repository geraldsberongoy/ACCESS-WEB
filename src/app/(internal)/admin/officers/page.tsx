import {
  createOfficerAction,
  deactivateOfficerAction,
  updateOfficerAction,
} from "@/features/officers/actions/officers.actions";
import { getAllOfficers } from "@/features/officers/services/officers.services";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    status?: "success" | "error";
    message?: string;
  }>;
};

export default async function AdminOfficersPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const status = params.status;
  const message = params.message;

  // Step 1: Load officers from the service layer on the server.
  // This keeps data fetching simple and secure for the admin page.
  const officers = await getAllOfficers({ includeInactive: true });

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

  // Step 2: Define form actions that call the action layer.
  // Each form action receives FormData and forwards it to the proper server action.
  async function handleCreate(formData: FormData) {
    "use server";
    const result = await createOfficerAction({ status: "idle" }, formData);

    if (result.status === "error") {
      redirect(
        `/admin/officers?status=error&message=${encodeURIComponent(result.message)}`
      );
    }

    redirect("/admin/officers?status=success&message=Officer%20created%20successfully");
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    const result = await updateOfficerAction({ status: "idle" }, formData);

    if (result.status === "error") {
      redirect(
        `/admin/officers?status=error&message=${encodeURIComponent(result.message)}`
      );
    }

    redirect("/admin/officers?status=success&message=Officer%20updated%20successfully");
  }

  async function handleDeactivate(formData: FormData) {
    "use server";
    const id = formData.get("id");
    if (typeof id === "string" && id.length > 0) {
      const result = await deactivateOfficerAction({ status: "idle" }, id);

      if (result.status === "error") {
        redirect(
          `/admin/officers?status=error&message=${encodeURIComponent(result.message)}`
        );
      }

      redirect("/admin/officers?status=success&message=Officer%20deactivated%20successfully");
    }

    redirect("/admin/officers?status=error&message=Officer%20ID%20is%20required");
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-8 text-neutral-100 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Officers Admin</h1>
          <p className="text-sm text-neutral-400">
            Simple CRUD interface for backend workflow. Frontend team can replace this UI later.
          </p>
        </header>

        {status && message ? (
          <section
            className={
              status === "success"
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
          <h2 className="mb-4 text-lg font-medium">Create Officer</h2>

          {/*
            Step 3: Create form
            - Submits to handleCreate server action
            - Validation and database insert are handled in schema -> action -> service
          */}
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

        <section className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
          <h2 className="mb-4 text-lg font-medium">Existing Officers ({officers.length})</h2>

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
          </div>
        </section>
      </section>
    </main>
  );
}