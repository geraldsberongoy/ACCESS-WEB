"use client";

import Image from "next/image";
import OfficersRosterMedia from "@/features/cms/components/OfficersRosterMedia";
import type { OfficersSectionContent } from "@/features/cms";

type MeetTheOfficersSectionProps = {
  content: OfficersSectionContent;
};

export default function MeetTheOfficersSection({ content }: MeetTheOfficersSectionProps) {
  const rosterImage = content.officersImageUrl?.trim();

  return (
    <section className="relative overflow-hidden py-16 px-5 sm:px-8 md:px-16 lg:px-24">
      <div
        className="absolute left-0 right-0 pointer-events-none overflow-hidden top-[46%] sm:top-[44%] md:top-[42%] lg:top-[40%] -translate-y-1/2 h-[240px] sm:h-[260px] md:h-[300px] z-[1]"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 22%, black 78%, transparent 100%)",
        }}
      >
        <Image
          src={content.templateImageUrl}
          alt=""
          fill
          unoptimized={content.templateImageUrl.startsWith("http")}
          className="object-cover object-center"
          style={{
            opacity: 0.8,
            filter: "blur(2px) saturate(1.4)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 35%, black 65%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(180,50,10,0.30) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-20 mx-auto max-w-5xl w-full">
        <h2 className="mb-10 text-center text-6xl font-extrabold tracking-widest title-header">
          {content.title}
        </h2>

        <p
          className="mb-12 text-center text-sm sm:text-base max-w-lg mx-auto leading-relaxed"
          style={{ color: "rgb(255, 255, 255)" }}
        >
          {content.subtitle}
        </p>

        {rosterImage ? (
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <OfficersRosterMedia url={rosterImage} />
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-16 text-center text-sm text-white/60">
            Officers file will appear here once uploaded in the admin dashboard.
          </div>
        )}
      </div>
    </section>
  );
}
