import Image from "next/image"
import EventCard, { EventCardProps } from "@/components/ui/EventCard"
import CrystalDice3D from "@/components/ui/CrystalDice3D"

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

      <Image
        src="/EventsBG.png"
        alt=""
        fill
        className="absolute inset-0 z-0 object-cover pointer-events-none"
      />
      {/* Dark red overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "rgba(40,5,5,0.55)" }}
      />
      <CrystalDice3D className="absolute right-70" />


        <div className="relative z-10 mx-auto max-w-6xl">
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
