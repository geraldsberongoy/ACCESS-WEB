"use client";

import { signOut } from "@/features/auth/actions/auth.actions";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  items?: NavItem[];
}

export const landingNavItems: NavItem[] = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Events", href: "/#events" },
  { label: "Officers", href: "/#officers" },
  { label: "Borrow", href: "/#borrow" },
  { label: "Contact", href: "/#contact" },
];

function NavLink({
  href,
  label,
  className,
  onNavigate,
}: {
  href: string;
  label: string;
  className: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("/#")) return;

    const sectionId = href.slice(2);
    if (pathname !== "/") return;

    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
    onNavigate?.();
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {label}
    </Link>
  );
}

export default function Navbar({ items = landingNavItems }: NavbarProps) {
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

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const linkClass =
    "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-normal text-[#D8D8D8] transition-colors hover:text-white lg:px-4 lg:text-[15px]";
  const mobileLinkClass =
    "block rounded-xl px-3 py-2.5 text-sm font-normal text-[#D8D8D8] transition-colors hover:bg-white/5 hover:text-white";

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full px-3 pt-3 md:px-5 md:pt-4 lg:px-6 lg:pt-5">
      <nav
        className="mx-auto grid w-full max-w-[1248px] grid-cols-[1fr_auto] items-center gap-3 rounded-full border border-white/10 px-4 py-2 backdrop-blur-xl md:grid-cols-[auto_1fr_auto] md:gap-4 md:px-6 md:py-2.5"
        style={{
          background: "rgba(18, 18, 18, 0.82)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)",
        }}
        aria-label="Main navigation"
      >
        <Link href="/#home" className="flex shrink-0 items-center justify-self-start">
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
              <NavLink
                href={item.href}
                label={item.label}
                className={linkClass}
                onNavigate={() => setMenuOpen(false)}
              />
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

          {user ? (
            <form action={signOut} className="hidden sm:block">
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
          ) : null}

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

      {menuOpen ? (
        <div
          className="mx-auto mt-2 flex w-full max-w-[1248px] flex-col gap-3 rounded-3xl border border-white/10 px-5 pb-5 pt-4 backdrop-blur-xl md:hidden"
          style={{
            background: "rgba(18, 18, 18, 0.95)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.35)",
          }}
        >
          <ul className="flex list-none flex-col gap-1 p-0">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  label={item.label}
                  className={mobileLinkClass}
                  onNavigate={() => setMenuOpen(false)}
                />
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
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
