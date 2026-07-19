"use client";

import { signOut } from "@/features/auth/actions/auth.actions";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Borrow", href: "/borrow" },
  { label: "Contact", href: "/contact" },
  { label: "Officers", href: "/officers" },
];

export default function Navbar({ items = defaultItems }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const syncUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const nextUser = session?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setIsAdmin(false);
        return;
      }

      const { data: userRow } = await supabase
        .from("Users")
        .select("role")
        .eq("id", nextUser.id)
        .maybeSingle();

      setIsAdmin(userRow?.role === "Admin");
    };

    syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh();
      }
      void syncUser();
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="sticky top-0 z-50 w-full px-3 pt-3 md:px-5 md:pt-4 lg:px-6 lg:pt-5">
      <nav
        className="mx-auto grid w-full max-w-[1248px] grid-cols-[1fr_auto] items-center gap-3 rounded-full border border-white/10 px-4 py-2 backdrop-blur-xl md:grid-cols-[auto_1fr_auto] md:gap-4 md:px-6 md:py-2.5"
        style={{
          background: "rgba(18, 18, 18, 0.72)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)",
        }}
      >
        <Link href="/" className="flex shrink-0 items-center justify-self-start">
          <Image
            src="/AccessLogo.webp"
            alt="ACCESS"
            width={140}
            height={40}
            className="h-8 w-auto object-contain md:h-9"
            priority
          />
        </Link>

        <ul className="hidden list-none items-center justify-center gap-1 p-0 md:flex lg:gap-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-normal text-[#D8D8D8] transition-colors hover:text-white lg:px-4 lg:text-[15px]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end gap-2 justify-self-end md:gap-3">
          {isAdmin ? (
            <Link
              href="/admin"
              className="hidden items-center gap-2 rounded-full border border-[#F26223]/45 bg-[#F26223]/15 px-3 py-1.5 transition hover:bg-[#F26223]/25 sm:inline-flex"
              title="Open admin dashboard"
            >
              <span className="rounded-full bg-[#F26223] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Admin
              </span>
              <span className="text-xs font-medium text-[#FFD4BC]">Dashboard</span>
            </Link>
          ) : null}

          <div className="relative hidden h-8 w-[140px] shrink-0 md:block lg:w-[160px]">
            <input
              type="text"
              placeholder=""
              aria-label="Search"
              className="absolute inset-0 z-10 h-full w-full rounded-xl border border-white/10 bg-transparent px-3 pr-9 text-sm outline-none"
              style={{ color: "#D8D8D8", fontFamily: "Inter, sans-serif" }}
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{ background: "rgba(242, 98, 35, 0.45)" }}
            />
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 z-20 -translate-y-1/2"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D8D8D8"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {user ? (
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-xl px-3 py-2 text-xs font-semibold text-white transition-all hover:opacity-90 sm:px-4 sm:text-sm"
                style={{
                  background: "linear-gradient(180deg, #F26223 0%, #C93A12 100%)",
                  boxShadow: "0 4px 14px rgba(242, 98, 35, 0.35)",
                }}
              >
                Logout
              </button>
            </form>
          ) : (
            <Link
              href="/auth"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#D8D8D8] transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Sign in"
              title="Sign in"
            >
              <ProfileIcon />
            </Link>
          )}

          <button
            type="button"
            className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-[5px] md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-0.5 w-5 rounded-full bg-[#D8D8D8] transition-transform duration-200 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-[#D8D8D8] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-[#D8D8D8] transition-transform duration-200 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="mx-auto mt-2 flex w-full max-w-[1248px] flex-col gap-4 rounded-3xl border border-white/10 px-5 pb-5 pt-4 backdrop-blur-xl md:hidden"
          style={{
            background: "rgba(18, 18, 18, 0.92)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)",
          }}
        >
          <div className="relative h-10 w-full">
            <input
              type="text"
              placeholder="Search…"
              aria-label="Search"
              className="absolute inset-0 h-full w-full rounded-xl border border-white/10 px-4 pr-10 text-sm outline-none"
              style={{
                background: "rgba(242, 98, 35, 0.35)",
                color: "#D8D8D8",
                fontFamily: "Inter, sans-serif",
              }}
            />
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D8D8D8"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <ul className="flex list-none flex-col gap-1 p-0">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-3 py-2.5 text-sm font-normal text-[#D8D8D8] transition-colors hover:bg-white/5 hover:text-white"
                  style={{ fontFamily: "Inter, sans-serif" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {isAdmin ? (
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 rounded-xl border border-[#F26223]/35 bg-[#F26223]/15 px-4 py-2.5 text-sm font-medium text-[#FFD4BC] transition hover:bg-[#F26223]/25"
              onClick={() => setMenuOpen(false)}
            >
              <span className="rounded-full bg-[#F26223] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Admin
              </span>
              Open dashboard
            </Link>
          ) : null}

          {user ? (
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(180deg, #F26223 0%, #C93A12 100%)",
                }}
                onClick={() => setMenuOpen(false)}
              >
                Logout
              </button>
            </form>
          ) : (
            <Link
              href="/auth"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-[#D8D8D8] transition-colors hover:bg-white/5"
              onClick={() => setMenuOpen(false)}
            >
              <ProfileIcon />
              Sign in
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function ProfileIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" />
    </svg>
  );
}
