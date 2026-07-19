import Link from "next/link";
import { getAdminDashboardStats } from "@/features/cms";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 transition hover:border-orange-600/40 hover:bg-neutral-900"
    >
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </Link>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  const quickLinks = [
    { href: "/admin/content/landing", label: "Edit landing page" },
    { href: "/admin/content/about", label: "Edit about us" },
    { href: "/admin/events/new", label: "Create event" },
    { href: "/admin/content/officers-template", label: "Upload officers template" },
    { href: "/admin/content/faqs", label: "Manage FAQs" },
    { href: "/admin/borrow-requests", label: "Review borrow requests" },
    { href: "/admin/contact-messages", label: "View contact messages" },
  ];

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h2>
          <p className="text-sm text-neutral-400">
            Manage landing page content, events, borrow requests, and contact messages.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Pending borrow requests"
            value={stats.pendingBorrowRequests}
            href="/admin/borrow-requests"
          />
          <StatCard
            label="Unread contact messages"
            value={stats.unreadContactMessages}
            href="/admin/contact-messages"
          />
          <StatCard label="Draft events" value={stats.draftEvents} href="/admin/events?status=Draft" />
          <StatCard label="Total FAQs" value={stats.faqCount} href="/admin/content/faqs" />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
            <h3 className="text-lg font-medium">Quick actions</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-orange-300 transition hover:text-orange-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent borrow requests</h3>
              <Link href="/admin/borrow-requests" className="text-sm text-orange-300">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentBorrowRequests.length === 0 ? (
                <p className="text-sm text-neutral-500">No borrow requests yet.</p>
              ) : (
                stats.recentBorrowRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-lg border border-neutral-800 bg-neutral-950/60 px-4 py-3"
                  >
                    <p className="text-sm font-medium text-white">
                      {request.borrower_contact_name ?? "Unknown borrower"}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {request.requested_item ?? "No item"} · {request.status ?? "Pending"}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {formatDate(request.created_at)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Recent contact messages</h3>
            <Link href="/admin/contact-messages" className="text-sm text-orange-300">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentContactMessages.length === 0 ? (
              <p className="text-sm text-neutral-500">No contact messages yet.</p>
            ) : (
              stats.recentContactMessages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-lg border border-neutral-800 bg-neutral-950/60 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{message.full_name}</p>
                    {!message.is_read && (
                      <span className="rounded-full bg-orange-600/20 px-2 py-0.5 text-xs text-orange-300">
                        Unread
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400">{message.email}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-300">{message.concern}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {formatDate(message.created_at)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
