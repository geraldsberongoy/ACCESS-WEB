"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
];

const glassStyle = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.13)",
  background: "rgba(255,255,255,0.03)",
  boxShadow: "0 4px 4px 0 rgba(0,0,0,0.50)",
} as const;

export default function Navbar({ items = defaultItems }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // Outer wrapper — tighter padding on phone, roomier on desktop
    <div className="w-full sticky top-0 z-50 px-3 pt-3 md:px-5 md:pt-4 lg:px-6 lg:pt-5">

      <nav
        className="mx-auto flex w-full max-w-[1248px] items-center backdrop-blur-[16.5px]
                   gap-3 px-4 py-2
                   md:gap-5 md:px-5 md:py-3
                   lg:gap-6 lg:px-6 lg:py-3"
        style={glassStyle}
      >
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center shrink-0 mr-auto">
          <Image
            src="/AccessLogo.webp"
            alt="ACCESS Logo"
            // phone: 110×50 | tablet: 130×60 | desktop: 150×70
            width={150}
            height={70}
            className="object-contain rounded-lg
                       w-[110px] h-[50px]
                       md:w-[130px] md:h-[60px]
                       lg:w-[150px] lg:h-[70px]"
            priority
          />
        </Link>

        {/* ── Tablet + Desktop nav links ── */}
        {/* Hidden on phone (<md), compact on tablet (md→lg), full on desktop (lg+) */}
        <ul className="hidden md:flex items-center list-none m-0 p-0
                       gap-1 md:gap-2 lg:gap-4">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="whitespace-nowrap font-normal transition-colors hover:text-white
                           text-sm px-3 py-1.5
                           lg:text-base lg:px-5 lg:py-2"
                style={{ color: "#D8D8D8", fontFamily: "Inter, sans-serif" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Desktop search pill (lg+) ── */}
        <div
          className="relative hidden lg:block shrink-0 ml-auto"
          style={{ width: 160, height: 32 }}
        >
          <input
            type="text"
            placeholder=""
            aria-label="Search"
            className="absolute inset-0 w-full h-full bg-transparent border-none outline-none z-10 text-sm"
            style={{
              padding: "0 36px 0 12px",
              fontFamily: "Inter, sans-serif",
              color: "#D8D8D8",
              boxSizing: "border-box",
            }}
          />
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="160"
            height="32"
            viewBox="0 0 160 32"
            fill="none"
            className="absolute inset-0 pointer-events-none"
          >
            <rect width="160" height="32" rx="10" fill="#F26223" fillOpacity="0.5" />
            <rect x="0.5" y="0.5" width="159" height="31" rx="9.5" stroke="white" strokeOpacity="0.13" />
            <path
              d="M149.067 23L144.867 17.75C144.533 18.0833 144.15 18.3472 143.717 18.5417C143.283 18.7361 142.822 18.8333 142.333 18.8333C141.122 18.8333 140.097 18.3089 139.259 17.26C138.42 16.2111 138 14.93 138 13.4167C138 11.9033 138.419 10.6222 139.259 9.57333C140.098 8.52444 141.123 8 142.333 8C143.544 8 144.569 8.52444 145.409 9.57333C146.249 10.6222 146.668 11.9033 146.667 13.4167C146.667 14.0278 146.589 14.6042 146.433 15.1458C146.278 15.6875 146.067 16.1667 145.8 16.5833L150 21.8333L149.067 23ZM142.333 17.1667C143.167 17.1667 143.875 16.8022 144.459 16.0733C145.042 15.3444 145.334 14.4589 145.333 13.4167C145.333 12.3744 145.041 11.4892 144.459 10.7608C143.876 10.0325 143.168 9.66778 142.333 9.66667C143.499 9.66556 140.791 10.0303 140.209 10.7608C139.626 11.4914 139.335 12.3767 139.333 13.4167C139.332 14.4567 139.624 15.3422 140.209 16.0733C140.794 16.8044 141.502 17.1689 142.333 17.1667Z"
              fill="#D8D8D8"
            />
          </svg>
        </div>

        {/* ── Tablet search icon button (md→lg) ── */}
        <button
          className="hidden md:flex lg:hidden items-center justify-center w-8 h-8 shrink-0 ml-auto transition-opacity hover:opacity-70"
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D8D8D8" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* ── Hamburger — phone only (<md) ── */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 shrink-0"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={`block h-0.5 w-5 rounded-full bg-[#D8D8D8] transition-transform duration-200 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 rounded-full bg-[#D8D8D8] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 rounded-full bg-[#D8D8D8] transition-transform duration-200 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* ── Phone dropdown menu ── */}
      {menuOpen && (
        <div
          className="md:hidden mx-auto mt-2 w-full max-w-[1248px] px-5 pb-5 pt-4 flex flex-col gap-4 backdrop-blur-[16.5px]"
          style={glassStyle}
        >
          {/* Phone search input */}
          <div className="relative w-full h-10">
            <input
              type="text"
              placeholder="Search…"
              aria-label="Search"
              className="absolute inset-0 w-full h-full rounded-xl border border-white/10 bg-white/5 px-4 pr-10 text-sm outline-none"
              style={{ color: "#D8D8D8", fontFamily: "Inter, sans-serif" }}
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D8D8D8" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Phone nav links */}
          <ul className="flex flex-col gap-1 list-none m-0 p-0">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-normal transition-colors hover:bg-white/5 hover:text-white"
                  style={{ color: "#D8D8D8", fontFamily: "Inter, sans-serif" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
