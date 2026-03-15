import EventCard, { EventCardProps } from "@/components/ui/EventCard"
import EventsGradientBg from "@/components/ui/EventsGradientBg"

const MOCK_EVENTS: EventCardProps[] = [
  {
    title: "Junior and Senior Hardhatting",
    subtitle: "Lorem ipsum dolor sit amet consectetur",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum",
    date: "February 20, 2026",
    image: "/BG-ACCESS.png",
    href: "#",
  },
  {
    title: "Junior and Senior Hardhatting",
    subtitle: "Lorem ipsum dolor sit amet consectetur",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum",
    date: "February 20, 2026",
    image: "/BG-ACCESS.png",
    href: "#",
  },
  {
    title: "Junior and Senior Hardhatting",
    subtitle: "Lorem ipsum dolor sit amet consectetur",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum",
    date: "February 20, 2026",
    image: "/BG-ACCESS.png",
    href: "#",
  },
  {
    title: "Junior and Senior Hardhatting",
    subtitle: "Lorem ipsum dolor sit amet consectetur",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum",
    date: "February 20, 2026",
    image: "/BG-ACCESS.png",
    href: "#",
  },
  {
    title: "Junior and Senior Hardhatting",
    subtitle: "Lorem ipsum dolor sit amet consectetur",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum",
    date: "February 20, 2026",
    image: "/BG-ACCESS.png",
    href: "#",
  },
  {
    title: "Junior and Senior Hardhatting",
    subtitle: "Lorem ipsum dolor sit amet consectetur",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum",
    date: "February 20, 2026",
    image: "/BG-ACCESS.png",
    href: "#",
  },
]

export default function EventsSection() {
  return (
    <div className="relative overflow-hidden py-20 px-5 sm:px-8 md:px-16 lg:px-24">
      {/* ShaderGradient background — absolute fill */}
      <div className="absolute inset-0 z-0">
        <EventsGradientBg />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section heading */}
        <h2
          className="mb-10 text-center text-6xl font-extrabold tracking-widest"
          style={{
            background: "linear-gradient(180deg, #F5C4A0 20%, #F26223 45%, #7B2210 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(2px 3px 4px rgba(0,0,0,0.5))",
          }}
        >
          Events
        </h2>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_EVENTS.map((event, i) => (
            <EventCard key={i} {...event} />
          ))}
        </div>
      </div>
    </div>
  )
}
