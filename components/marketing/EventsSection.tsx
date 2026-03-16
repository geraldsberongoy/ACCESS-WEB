import EventCard, { EventCardProps } from "@/components/ui/EventCard"

const MOCK_EVENTS: EventCardProps[] = [
  {
    title: "Junior and Senior Hardhatting",
    subtitle: "Lorem ipsum dolor sit amet consectetur",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum",
    date: "February 20, 2026",
    image: "/BG-ACCESS.png",
    href: "/not-found",
  },
  {
    title: "Junior and Senior Hardhatting",
    subtitle: "Lorem ipsum dolor sit amet consectetur",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum",
    date: "February 20, 2026",
    image: "/BG-ACCESS.png",
    href: "/not-found",
  },
  {
    title: "Junior and Senior Hardhatting",
    subtitle: "Lorem ipsum dolor sit amet consectetur",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum",
    date: "February 20, 2026",
    image: "/BG-ACCESS.png",
    href: "/not-found",
  },
  {
    title: "Junior and Senior Hardhatting",
    subtitle: "Lorem ipsum dolor sit amet consectetur",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum",
    date: "February 20, 2026",
    image: "/BG-ACCESS.png",
    href: "/not-found",
  },
  {
    title: "Junior and Senior Hardhatting",
    subtitle: "Lorem ipsum dolor sit amet consectetur",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum",
    date: "February 20, 2026",
    image: "/BG-ACCESS.png",
    href: "/not-found",
  },
  {
    title: "Junior and Senior Hardhatting",
    subtitle: "Lorem ipsum dolor sit amet consectetur",
    description:
      "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur Lorem ipsum",
    date: "February 20, 2026",
    image: "/BG-ACCESS.png",
    href: "/not-found",
  },
]

export default function EventsSection() {
  return (
    <div className="py-20 px-5 sm:px-8 md:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl">
          {/* Section heading */}
          <h2 className="mb-10 text-center text-6xl font-extrabold tracking-widest title-header">
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
