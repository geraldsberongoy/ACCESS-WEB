"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/content/landing", label: "Landing Content" },
  { href: "/admin/content/about", label: "About Us" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/content/officers-template", label: "Section Background" },
  { href: "/admin/officers", label: "Officers Image" },
  { href: "/admin/content/faqs", label: "FAQs" },
  { href: "/admin/borrow-requests", label: "Borrow Requests" },
  { href: "/admin/contact-messages", label: "Contact Messages" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950">
      <div className="border-b border-neutral-800 px-5 py-6">
        <Link href="/admin" className="text-lg font-semibold tracking-tight text-white">
          ACCESS Admin
        </Link>
        <p className="mt-1 text-xs text-neutral-500">CRM Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-600/20 text-orange-300"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-800 px-5 py-4">
        <Link
          href="/"
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-300"
        >
          View public site
        </Link>
      </div>
    </aside>
  );
}
