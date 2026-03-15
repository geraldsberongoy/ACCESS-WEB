import Image from "next/image"

export interface OfficerCardProps {
  name: string
  role: string
  description: string
  image: string
  featured?: boolean
}

export default function OfficerCard({
  name,
  role,
  description,
  image,
  featured = false,
}: OfficerCardProps) {
  return (
    <div
      className={`relative flex flex-col items-center text-center overflow-hidden transition-all duration-500 select-none ${
        featured ? "z-10" : "opacity-75"
      }`}
      style={{
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.18)",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(22px)",
        boxShadow: featured
          ? "0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.14)"
          : "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
        width: featured ? "300px" : "260px",
        flexShrink: 0,
      }}
    >
      {/* Lava / marble texture overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(200,60,10,0.55) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 10%, rgba(255,140,20,0.40) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(120,20,10,0.60) 0%, transparent 55%),
            radial-gradient(ellipse at 10% 70%, rgba(180,40,5,0.45) 0%, transparent 50%),
            linear-gradient(160deg, #7B1010 0%, #C0321A 30%, #8B1A0A 55%, #CC4A20 75%, #6B1208 100%)
          `,
          opacity: 0.72,
          mixBlendMode: "overlay",
        }}
      />
      {/* Solid dark base so text is always readable */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "linear-gradient(160deg, #2a0a0a 0%, #5c1010 50%, #2a0808 100%)",
        }}
      />

      {/* Avatar */}
      <div
        className="relative z-10 mt-8 rounded-full overflow-hidden border-2 border-white/20 shadow-xl"
        style={{ width: featured ? 88 : 76, height: featured ? 88 : 76, flexShrink: 0 }}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      {/* Text content */}
      <div className="relative z-10 mt-4 px-6 pb-7">
        <h3
          className="font-bold text-white leading-snug"
          style={{ fontSize: featured ? "1.1rem" : "1rem" }}
        >
          {name}
        </h3>
        <p
          className="mt-1 text-sm font-semibold"
          style={{ color: "#F26223" }}
        >
          {role}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">{description}</p>
      </div>
    </div>
  )
}
