import Image from "next/image"

export interface OfficerCardProps {
  name: string
  role: string
  description: string
  image: string
  featured?: boolean
}

/* ---------- Lava banner ---------- */
const LAVA = `
  linear-gradient(38deg,
    transparent 27%, rgba(255,175,10,0.92) 29.5%, rgba(255,215,55,1) 30.5%,
    rgba(255,175,10,0.92) 31.5%, transparent 34%),
  linear-gradient(56deg,
    transparent 44%, rgba(230,95,0,0.80) 46%, rgba(255,148,0,0.90) 47%,
    rgba(230,95,0,0.80) 48%, transparent 50%),
  linear-gradient(130deg,
    transparent 54%, rgba(255,130,0,0.70) 56%, rgba(255,185,30,0.80) 57%,
    rgba(255,130,0,0.70) 58%, transparent 60%),
  linear-gradient(170deg,
    transparent 34%, rgba(200,55,0,0.55) 36%, rgba(240,110,10,0.65) 37%,
    transparent 39%),
  linear-gradient(-15deg,
    transparent 58%, rgba(195,50,0,0.60) 60%, rgba(245,115,5,0.70) 61%,
    transparent 63%),
  radial-gradient(ellipse at 22% 52%, rgba(255,110,0,0.75)  0%, transparent 38%),
  radial-gradient(ellipse at 75% 22%, rgba(210,65,0,0.65)   0%, transparent 32%),
  radial-gradient(ellipse at 60% 82%, rgba(185,40,0,0.55)   0%, transparent 30%),
  radial-gradient(ellipse at 10% 78%, rgba(235,95,0,0.55)   0%, transparent 28%),
  radial-gradient(ellipse at 88% 65%, rgba(255,145,15,0.50) 0%, transparent 26%),
  linear-gradient(145deg, #090100 0%, #1d0301 35%, #0d0200 65%, #220502 100%)
`

const AVATAR_SIZE = 88
const BANNER_H    = 144

export default function OfficerCard({
  name,
  role,
  description,
  image,
  featured = false,
}: OfficerCardProps) {
  return (
    <div
      className="relative flex flex-col select-none transition-all duration-500 flex-shrink-0"
      style={{
        width          : 280,
        borderRadius   : 24,
        border         : "1px solid rgba(255, 255, 255, 0.13)",
        background     : "rgba(255, 255, 255, 0.03)",
        backdropFilter : "blur(16.5px)",
        boxShadow      : featured
          ? "0 28px 72px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.08)"
          : "0 10px 40px rgba(0,0,0,0.40)",
        overflow : "hidden",
        opacity  : featured ? 1 : 0.78,
      }}
    >
      {/* ── Lava banner ─────────────────────────────────────── */}
      <div
        className="relative w-full flex-shrink-0"
        style={{ height: BANNER_H, background: LAVA }}
      >
        {/* Subtle vignette at the edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        {/* Fade into card body */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: 52,
            background: "linear-gradient(to top, rgba(6,1,1,0.88) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Avatar — straddles banner / body ────────────────── */}
      <div
        className="absolute left-1/2 rounded-full overflow-hidden flex-shrink-0"
        style={{
          width     : AVATAR_SIZE,
          height    : AVATAR_SIZE,
          top       : BANNER_H - AVATAR_SIZE / 2,
          transform : "translateX(-50%)",
          border    : "2.5px solid rgba(255, 255, 255, 0.22)",
          boxShadow : [
            "0 0 0 4px rgba(255,255,255,0.05)",
            "0 8px 32px rgba(0,0,0,0.60)",
            "inset 0 1px 0 rgba(255,255,255,0.15)",
          ].join(", "),
        }}
      >
        <div className="relative w-full h-full">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div
        className="flex flex-col items-center text-center w-full px-6"
        style={{ paddingTop: AVATAR_SIZE / 2 + 14, paddingBottom: 26 }}
      >
        {/* Name */}
        <h3
          className="font-bold leading-snug"
          style={{
            color    : "rgba(255, 255, 255, 1)",
            fontSize : "1.05rem",
          }}
        >
          {name}
        </h3>

        {/* Role */}
        <p
          className="mt-1 font-semibold tracking-wide"
          style={{ color: "rgba(242, 98, 35, 1)", fontSize: "0.8125rem" }}
        >
          {role}
        </p>

        {/* Thin divider */}
        <div
          className="my-3 rounded-full"
          style={{
            width      : 40,
            height     : 1,
            background : "rgba(255, 255, 255, 0.10)",
          }}
        />

        {/* Description */}
        <p
          className="leading-relaxed"
          style={{
            color    : "rgba(255, 245, 240, 0.75)",
            fontSize : "0.8125rem",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
