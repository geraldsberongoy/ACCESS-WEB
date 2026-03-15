import Navbar from "@/components/ui/Navbar";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-screen flex-col"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/55 pointer-events-none" />

        {/* navbar floats above overlay */}
        <div className="relative z-10">
          <Navbar />
        </div>

        {/* centred hero copy */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1
            className="max-w-4xl text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white"
          >
            <span className="block">
              Association of Concerned
            </span>
            <span
              className="block"
              style={{
                color: "#F7B497",
                fontWeight: 700,
                fontFamily: "inherit",
              }}
            >
              Computer Engineering
            </span>
            <span
              className="block"
              style={{
                background: "linear-gradient(90deg,#F26223 0%,#FF8C55 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 700,
                fontFamily: "inherit",
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              for Service
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm text-zinc-300 md:text-base">
            Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet
            consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/about"
              className="rounded-lg px-9 py-3 text-sm font-semibold text-white
                         transition-opacity hover:opacity-90 md:px-10 md:py-3.5 md:text-base"
              style={{ background: "#F26223" }}
            >
              Get Started
            </Link>

            <Link
              href="/contact"
              className="rounded-lg border border-white/30 bg-white/10 px-9 py-3 text-sm font-semibold
                         text-white backdrop-blur-sm transition-colors hover:bg-white/20
                         md:px-10 md:py-3.5 md:text-base"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
