import { signOut } from "@/features/auth/actions/auth.actions";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500">ACCESS CRM</p>
            <h1 className="text-lg font-semibold text-white">Administration</h1>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:border-neutral-500 hover:text-white"
            >
              Sign out
            </button>
          </form>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
