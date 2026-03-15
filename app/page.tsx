
import Navbar from "@/components/ui/Navbar";
import FloatingBlocks from "@/components/ui/FloatingBlocks";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col bg-black">
        {/* animated 3-D floating blocks — pinned to the right half */}
        <div className="absolute inset-y-0 left-150 bottom-40 w-full flex justify-end pointer-events-none">
          <div className="w-1/2 h-full">
            <FloatingBlocks />
          </div>
        </div>

        {/* navbar floats above overlay */}
        <div className="relative z-10 pt-4">
          <Navbar />
        </div>

        {/* centred hero copy */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center pb-12 text-center">
          <h1
            className="max-w-4xl text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(242,98,35,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Association of Concerned
            <br />
            Computer Engineering
            <br />
            for Service
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
