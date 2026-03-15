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
  logos = ["/AccessLogo.png"],
}: EventCardProps) {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all hover:-translate-y-0.5 duration-200"
      style={{ background: "linear-gradient(180deg, #2a0a0a 0%, #1e0808 100%)" }}
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
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1e0808] to-transparent" />

        

        {/* Date pill — white bg, dark text */}
        <span className="absolute top-2.5 left-2.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-900 shadow-md">
          {date}
        </span>


      </div>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5 px-4 pb-5 pt-3">
        <Link
          href={href}
          className="group flex items-start gap-1.5 text-base font-bold text-white leading-snug hover:text-orange-400 transition-colors"
        >
          <span>{title}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mt-0.5 h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
          >
            <path
              fillRule="evenodd"
              d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5ZM10 2.75a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 .75.75v6.5a.75.75 0 0 1-1.5 0V4.56l-5.47 5.47a.75.75 0 0 1-1.06-1.06L15.44 3.5h-4.69a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>

        <p className="text-xs font-medium text-zinc-400">{subtitle}</p>

        <div className="h-px w-full bg-white/10" />

        <p className="text-xs leading-relaxed text-zinc-500 line-clamp-3">{description}</p>
      </div>
    </div>
  )
}
