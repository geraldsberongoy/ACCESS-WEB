"use client";

import { useEffect, useState } from "react";

export default function AboutSection() {
  const [scale, setScale] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;
      // On desktop, available width is roughly half the screen minus some padding
      // On mobile, available width is full window minus padding
      const availableW = isDesktop 
        ? (window.innerWidth / 2) - 48
        : window.innerWidth - 32;
        
      const TARGET_W = 592; // The fixed width of the banner (180+16+200+16+180)
      if (availableW < TARGET_W) {
        setScale(availableW / TARGET_W);
      } else {
        setScale(1);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Panorama slice constants ──────────────────────────────────────────
  const W1 = 180;
  const W2 = 200;
  const W3 = 180;
  const GAP = 16;

  // Natural image dimensions (AboutUsPic.webp)
  const IMG_NATURAL_W = 1456;
  const IMG_NATURAL_H = 816;
  const CARD_TALLEST_H = 560; // card 2 height — image scaled to fill this

  // Scale image width so its natural height equals the tallest card — no stretching
  const IMG_SCALED_W = Math.round(CARD_TALLEST_H * (IMG_NATURAL_W / IMG_NATURAL_H)); // ~999px

  const x1 = 0;
  const x2 = W1 + GAP;             // 196
  const x3 = W1 + GAP + W2 + GAP;  // 412

  const panoramaBg = (offsetX: number): React.CSSProperties => ({
    backgroundImage: "url('/AboutUsPic.webp')",
    backgroundSize: `${IMG_SCALED_W}px auto`, // height scales naturally — no distortion
    backgroundPosition: `-${offsetX}px 0px`,
    backgroundRepeat: "no-repeat",
  });

  const glassOutline: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.30)",
  };

  return (
    <section
      className="relative overflow-hidden md:py-16"
      style={{
        background:
          "linear-gradient(135deg, #672b03ff 0%, #e84d0e 30%, #c73a08 55%, #a82d06 75%, #8b2005 100%)",
      }}
    >
      {/* ── bokeh / glow blobs ──────────────────────────────────────────── */}

      {/* Top-left warm yellow burst */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-5%",
          left: "-2%",
          width: "380px",
          height: "380px",
          background:
            "radial-gradient(ellipse at center, rgba(255,220,80,0.75) 0%, rgba(255,160,30,0.45) 40%, transparent 72%)",
          filter: "blur(38px)",
          zIndex: 1,
        }}
      />

      {/* Mid-left softer amber */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "45%",
          left: "5%",
          width: "260px",
          height: "260px",
          background:
            "radial-gradient(ellipse at center, rgba(255,180,40,0.55) 0%, rgba(255,120,10,0.30) 50%, transparent 75%)",
          filter: "blur(28px)",
          zIndex: 1,
        }}
      />

      {/* Bottom-center warm glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-2%",
          left: "28%",
          width: "320px",
          height: "320px",
          background:
            "radial-gradient(ellipse at center, rgba(255,140,20,0.50) 0%, rgba(220,80,10,0.25) 50%, transparent 72%)",
          filter: "blur(35px)",
          zIndex: 1,
        }}
      />

      {/* Top-right warm burst */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-8%",
          right: "-3%",
          width: "350px",
          height: "350px",
          background:
            "radial-gradient(ellipse at center, rgba(255,210,60,0.65) 0%, rgba(255,140,20,0.38) 42%, transparent 70%)",
          filter: "blur(42px)",
          zIndex: 1,
        }}
      />

      {/* Bottom-right amber glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: "-5%",
          right: "2%",
          width: "280px",
          height: "280px",
          background:
            "radial-gradient(ellipse at center, rgba(255,160,30,0.55) 0%, rgba(220,90,10,0.28) 48%, transparent 74%)",
          filter: "blur(32px)",
          zIndex: 1,
        }}
      />

      {/* ── Full-width layout — left 50% text, right 50% cards ──────────── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center">

        {/* LEFT col — 50% width ──────────────────────────────────────────── */}
        <div
          className="flex shrink-0 flex-col px-6 pt-16 pb-10 md:w-1/2 md:pl-12 md:pr-10 md:py-16 lg:pl-20 lg:pr-16"
        >
          {/* "About Us" heading */}
          <h2
            className="whitespace-nowrap text-[clamp(2.4rem,5.5vw,5.5rem)] font-extrabold leading-none text-white title-header"
            style={{ letterSpacing: "0.18em" }}
          >
            About Us
          </h2>

          {/* White underline stretching toward card 2 */}
          <div
            className="mb-5 mt-4 h-[3px] w-full"
            style={{ background: "rgba(255,255,255,0.90)" }}
          />

          {/* description */}
          <p className="max-w-sm text-sm leading-relaxed text-white/90 sm:text-base">
            Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet
            consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor
            sit amet consectetur
          </p>
        </div>

        {/* RIGHT col — remaining 50%, cards flush left, overflow downward ── */}
        <div className="relative flex flex-1 items-start justify-center overflow-visible px-4 pt-4 pb-12 md:justify-start md:px-0 md:pb-0 md:pt-0">
          {/* Sizing wrapper to reserve height in document flow for scaled content */}
          <div
            style={{
              width: mounted ? `${592 * scale}px` : "100%",
              height: mounted ? `${560 * scale}px` : "560px",
              position: "relative",
              transition: "width 0.2s ease-out, height 0.2s ease-out",
            }}
          >
            {/* The scaled inner container containing the cards */}
            <div
              className="absolute left-0 top-0 flex origin-top-left"
              style={{
                gap: `${GAP}px`,
                transform: `scale(${scale})`,
                width: "592px",
                transition: "transform 0.2s ease-out",
              }}
            >
              {/* Card 1 — left slice, shorter */}
              <div
                className="shrink-0 overflow-hidden"
                style={{
                  width: `${W1}px`,
                  height: "260px",
                  borderRadius: "18px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.40)",
                  ...panoramaBg(x1),
                  ...glassOutline,
                }}
              />

              {/* Card 2 — middle slice, tallest */}
              <div
                className="shrink-0 overflow-hidden"
                style={{
                  width: `${W2}px`,
                  height: "560px",
                  borderRadius: "18px",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.50)",
                  ...panoramaBg(x2),
                  ...glassOutline,
                }}
              />

              {/* Card 3 — right slice + description pill */}
              <div className="flex shrink-0 flex-col" style={{ gap: "12px" }}>
                <div
                  className="overflow-hidden"
                  style={{
                    width: `${W3}px`,
                    height: "370px",
                    borderRadius: "18px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.40)",
                    ...panoramaBg(x3),
                    ...glassOutline,
                  }}
                />
                <div
                  className="rounded-xl px-4 py-3"
                  style={{ width: `${W3}px` }}
                >
                  <p className="text-xs leading-relaxed text-white/90">
                    Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet
                    consectetur Lorem ipsum dolor sit amet consectetur
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
