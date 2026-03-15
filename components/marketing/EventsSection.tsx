import EventCard, { EventCardProps } from "@/components/ui/EventCard"

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
    <section className="relative overflow-hidden bg-[#1a0505] py-20 px-5 sm:px-8 md:px-16 lg:px-24">
      {/* Background geometric shapes — bottom-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-10%",
          left: "-8%",
          width: "40%",
          height: "70%",
          background:
            "radial-gradient(ellipse at bottom left, rgba(180,20,20,0.6) 0%, rgba(120,10,10,0.3) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Background geometric shapes — top-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-5%",
          right: "-5%",
          width: "35%",
          height: "50%",
          background:
            "radial-gradient(ellipse at top right, rgba(160,15,15,0.5) 0%, rgba(100,5,5,0.2) 50%, transparent 75%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section heading */}
        <h2
          className="mb-10 text-center text-4xl font-bold tracking-widest uppercase"
          style={{
            background: "linear-gradient(180deg, #f5c07a 0%, #c8742a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
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
    </section>
  )
}
