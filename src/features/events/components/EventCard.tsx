import Image from "next/image"
import Link from "next/link"

export interface EventCardProps {
  title: string
  subtitle: string
  description: string
  date: string
  image: string
  href?: string
  logos?: string[]
}

export default function EventCard({
  title,
  subtitle,
  description,
  date,
  image,
  href = "#",
  logos = ["/AccessLogo.webp"],
}: EventCardProps) {
  return (
    <div
      className="flex flex-col overflow-hidden shrink-0 transition-all hover:-translate-y-0.5 duration-200"
      style={{
        width: "100%",
        maxWidth: 376,
        minHeight: 471,
        borderRadius: "24px",
        border: "1px solid rgba(255, 255, 255, 0.22)",
        background: "rgba(255, 255, 255, 0.09)",
        backdropFilter: "blur(24px)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.35)",
      }}
    >
      {/* ── Image ──────────────────────────────────────────── */}
      <div className="relative h-52 w-full shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        {/* Bottom gradient fade into card body */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Date pill — white bg, dark text */}
        <span className="absolute top-5.5 left-5.5 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-gray-900 shadow-md">
          {date}
        </span>
      </div>
      {/* ── Body ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-8 pb-5 pt-8">
        <Link
          href={href}
          className="group flex items-start gap-2 text-lg font-bold text-white leading-snug hover:text-orange-400 transition-colors"
        >
          <span>{title}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mt-0.5 h-5 w-5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
          >
            <path
              fillRule="evenodd"
              d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5ZM10 2.75a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0V4.56l-5.47 5.47a.75.75 0 0 1-1.06-1.06L15.44 3.5h-4.69a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>

        <p className="text-sm font-semibold text-zinc-400">{subtitle}</p>

        <div className="h-px w-full" />

        <p className="text-sm leading-relaxed text-zinc-500 line-clamp-3">{description}</p>
      </div>
    </div>
  )
}
