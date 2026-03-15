import Navbar from "@/components/ui/Navbar";
import FloatingBlocks from "@/components/ui/FloatingBlocks";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col bg-black overflow-hidden">

        {/* background photo — shifted right on mobile so subject stays visible */}
        <Image
          src="/BG-ACCESS.png"
          alt=""
          fill
          priority
          className="object-cover object-[70%_center] sm:object-center"
        />

        {/* dark overlay — slightly heavier on mobile for text contrast */}
        <div className="absolute inset-0 bg-black/65 sm:bg-black/55 pointer-events-none" />

        {/* floating 3-D blocks — hidden on phone, right strip on tablet, half on desktop */}
        <div className="absolute inset-y-0 right-0 hidden sm:block sm:w-2/3 md:w-1/2 pointer-events-none">
          <FloatingBlocks />
        </div>

        {/* orange glow — bottom-right corner */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-14%",
            right: "-8%",
            width: "65%",
            height: "80%",
            background: "radial-gradient(ellipse at bottom right, rgba(242,98,35,0.95) 0%, rgba(242,98,35,0.65) 33%, rgba(242,98,35,0.4) 55%, rgba(180,60,10,0.28) 75%, transparent 97%)",
            filter: "blur(140px) brightness(1.3)",
            zIndex: 1,
          }}
        />

        {/* secondary softer glow — right-center */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "20%",
            right: "5%",
            width: "35%",
            height: "40%",
            background: "radial-gradient(ellipse at center, rgba(255,140,50,0.30) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* navbar */}
        <div className="relative z-10">
          <Navbar />
        </div>

        {/* hero copy */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-16 pt-4 text-center sm:px-8 sm:pb-12 md:px-16 lg:px-24">
          <h1
            className="max-w-xs text-3xl font-extrabold leading-tight tracking-tight
                       sm:max-w-lg sm:text-4xl
                       md:max-w-2xl md:text-5xl
                       lg:max-w-4xl lg:text-6xl"
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

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-300
                        sm:max-w-md sm:text-base
                        md:max-w-lg">
            Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet
            consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link
              href="/about"
              className="rounded-lg py-3 text-sm font-semibold text-white text-center
                         transition-opacity hover:opacity-90
                         px-8 sm:px-9 md:px-10 md:py-3.5 md:text-base"
              style={{ background: "#F26223" }}
            >
              Get Started
            </Link>

            <Link
              href="/contact"
              className="rounded-lg border border-white/30 bg-white/10 py-3 text-sm font-semibold
                         text-white text-center backdrop-blur-sm transition-colors hover:bg-white/20
                         px-8 sm:px-9 md:px-10 md:py-3.5 md:text-base"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
