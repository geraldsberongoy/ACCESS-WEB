import { Navbar } from "@/components/ui";
import { FooterSection } from "@/features/landing";
import { getOfficersSectionContent } from "@/features/cms";
import Image from "next/image";
import { CrystalDice3D, type CrystalConfig } from "@/features/effects";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const OFFICERS_CRYSTALS: CrystalConfig[] = [
  { x: -7.0, y: 4.2, z: 0.5, size: 2.6, hue: 0.02, sx: 0.003, sy: 0.004, sz: 0.002, fa: 0.32, fs: 0.45, phase: 0.0 },
  { x: -5.8, y: 1.5, z: -0.5, size: 1.4, hue: 0.01, sx: 0.005, sy: 0.003, sz: 0.004, fa: 0.24, fs: 0.60, phase: 1.1 },
  { x: -6.5, y: -0.8, z: 0.8, size: 1.0, hue: 0.00, sx: 0.004, sy: 0.006, sz: 0.003, fa: 0.18, fs: 0.75, phase: 2.3 },
  { x: -5.2, y: -2.5, z: -0.8, size: 0.7, hue: 0.015, sx: 0.006, sy: 0.004, sz: 0.005, fa: 0.14, fs: 0.85, phase: 3.5 },
  { x: -6.8, y: -4.5, z: 0.3, size: 2.0, hue: 0.02, sx: 0.003, sy: 0.005, sz: 0.003, fa: 0.30, fs: 0.50, phase: 1.7 },
  { x: 6.8, y: 3.8, z: 0.5, size: 1.0, hue: 0.00, sx: 0.005, sy: 0.003, sz: 0.004, fa: 0.20, fs: 0.70, phase: 1.4 },
  { x: 7.2, y: -1.2, z: 0.8, size: 1.6, hue: 0.03, sx: 0.004, sy: 0.005, sz: 0.003, fa: 0.28, fs: 0.55, phase: 2.2 },
  { x: 6.0, y: -4.5, z: 0.5, size: 2.0, hue: 0.01, sx: 0.003, sy: 0.004, sz: 0.003, fa: 0.35, fs: 0.50, phase: 1.8 },
  { x: 2.5, y: 4.8, z: -1.2, size: 0.6, hue: 0.00, sx: 0.007, sy: 0.003, sz: 0.005, fa: 0.18, fs: 0.90, phase: 0.8 },
];

export default async function OfficersPage() {
  noStore();
  const content = await getOfficersSectionContent();
  const rosterImage = content.officersImageUrl?.trim();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white relative">
      <div className="sticky top-0 h-screen w-full z-0 overflow-hidden pointer-events-none">
        <Image
          src="/EventsBG.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" style={{ background: "#862520" }} />
        <CrystalDice3D crystals={OFFICERS_CRYSTALS} cameraZ={13} className="z-[1]" />
      </div>

      <div className="relative z-10 -mt-[100vh] flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 py-20 px-5 sm:px-8 md:px-16 lg:px-24 relative overflow-hidden">
          <div className="absolute top-[10%] left-[-30%] w-[600px] h-[500px] bg-black/85 blur-[120px] rounded-full pointer-events-none z-[-1] mix-blend-multiply" />
          <div className="absolute top-[30%] right-[-20%] w-[700px] h-[600px] bg-black/90 blur-[130px] rounded-full pointer-events-none z-[-1] mix-blend-multiply" />
          <div className="absolute top-[60%] left-[-30%] w-[600px] h-[600px] bg-black/85 blur-[140px] rounded-full pointer-events-none z-[-1] mix-blend-multiply" />
          <div className="absolute top-[85%] right-[-5%] w-[500px] h-[500px] bg-black/90 blur-[130px] rounded-full pointer-events-none z-[-1] mix-blend-multiply" />
          <div className="absolute top-[1%] left-[5%] w-[500px] h-[500px] bg-[#FFB800] opacity-40 blur-[140px] rounded-full pointer-events-none z-[-1]" />
          <div className="absolute top-[15%] right-[5%] w-[500px] h-[500px] bg-[#FFB800] opacity-40 blur-[140px] rounded-full pointer-events-none z-[-1]" />
          <div className="absolute top-[60%] left-[40%] w-[600px] h-[600px] bg-[#FF8C00] opacity-40 blur-[140px] rounded-full pointer-events-none z-[-1]" />
          <div className="absolute top-[90%] left-[15%] w-[400px] h-[400px] bg-[#FFB800] opacity-40 blur-[120px] rounded-full pointer-events-none z-[-1]" />

          <div className="text-center max-w-3xl mx-auto mb-12 relative z-20">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-widest title-header pb-2"
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #ffdfc4 40%, #f26223 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0px 8px 12px rgba(0,0,0,0.5))",
              }}
            >
              {content.title}
            </h1>
            <p className="mt-5 text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
              {content.subtitle}
            </p>
          </div>

          <div className="w-full max-w-5xl mx-auto relative z-20">
            {rosterImage ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <Image
                  src={rosterImage}
                  alt="Current ACCESS officers"
                  width={1400}
                  height={900}
                  className="h-auto w-full object-contain"
                  unoptimized={rosterImage.startsWith("http")}
                />
              </div>
            ) : (
              <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-16 text-center text-sm text-white/60">
                Officers image will appear here once uploaded in the admin dashboard.
              </div>
            )}
          </div>
        </main>

        <FooterSection />
      </div>
    </div>
  );
}
