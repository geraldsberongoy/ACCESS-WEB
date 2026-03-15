"use client"

import { useState } from "react"
import Image from "next/image"
import OfficerCard, { OfficerCardProps } from "@/components/ui/OfficerCard"

const MOCK_OFFICERS: Omit<OfficerCardProps, "featured">[] = [
  {
    name: "Antonio Mickel Tantia",
    role: "Control Officer",
    description: "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur",
    image: "/BG-ACCESS.png",
  },
  {
    name: "Antonio Mickel Tantia",
    role: "Control Officer",
    description: "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur",
    image: "/BG-ACCESS.png",
  },
  {
    name: "Antonio Mickel Tantia",
    role: "Control Officer",
    description: "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur",
    image: "/BG-ACCESS.png",
  },
  {
    name: "Antonio Mickel Tantia",
    role: "Control Officer",
    description: "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur",
    image: "/BG-ACCESS.png",
  },
  {
    name: "Antonio Mickel Tantia",
    role: "Control Officer",
    description: "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur",
    image: "/BG-ACCESS.png",
  },
]

export default function MeetTheOfficersSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = MOCK_OFFICERS.length

  const prev = () => setActiveIndex((i) => (i - 1 + total) % total)
  const next = () => setActiveIndex((i) => (i + 1) % total)

  /* Indices of the three visible cards */
  const leftIdx = (activeIndex - 1 + total) % total
  const centerIdx = activeIndex
  const rightIdx = (activeIndex + 1) % total

  return (
    <div className="relative overflow-hidden py-20 px-5 sm:px-8 md:px-16 lg:px-24">
      {/* Background photo */}
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

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Heading */}
        <h2
          className="mb-4 text-center text-5xl sm:text-6xl font-extrabold tracking-widest"
          style={{
            background: "linear-gradient(180deg, #F5C4A0 35%, #F26223 90%, #7B2210 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(2px 3px 4px rgba(0,0,0,0.5))",
          }}
        >
          Meet the Officers
        </h2>

        {/* Subtitle */}
        <p className="mb-14 text-center text-sm sm:text-base text-zinc-300 max-w-xl mx-auto leading-relaxed">
          We are a community of student leaders and innovators committed to advancing technology,
          collaboration, and excellence within PUP.
        </p>

        {/* Carousel */}
        <div className="relative flex items-center justify-center gap-6">
          {/* Left arrow */}
          <button
            onClick={prev}
            aria-label="Previous officer"
            className="absolute left-0 z-20 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/20"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="h-5 w-5">
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Three cards */}
          <div className="flex items-center justify-center gap-5 px-14">
            <OfficerCard {...MOCK_OFFICERS[leftIdx]} featured={false} />
            <OfficerCard {...MOCK_OFFICERS[centerIdx]} featured={true} />
            <OfficerCard {...MOCK_OFFICERS[rightIdx]} featured={false} />
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            aria-label="Next officer"
            className="absolute right-0 z-20 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/20"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="h-5 w-5">
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="mt-10 flex justify-center gap-2">
          {MOCK_OFFICERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to officer ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 24 : 8,
                height: 8,
                background: i === activeIndex ? "#F26223" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
