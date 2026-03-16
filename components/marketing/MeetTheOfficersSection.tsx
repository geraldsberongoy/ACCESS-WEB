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

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path
        fillRule="evenodd"
        d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default function MeetTheOfficersSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = MOCK_OFFICERS.length

  const prev = () => setActiveIndex((i) => (i - 1 + total) % total)
  const next = () => setActiveIndex((i) => (i + 1) % total)

  const leftIdx = (activeIndex - 1 + total) % total
  const centerIdx = activeIndex
  const rightIdx = (activeIndex + 1) % total

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col justify-center px-5 sm:px-8 md:px-16 lg:px-24 py-16">
      {/* ── Background photo ── */}
      <Image
        src="/EventsBG.png"
        alt=""
        fill
        className="absolute inset-0 z-0 object-cover pointer-events-none"
      />

      {/* ── Deep dark-red overlay ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(25,4,4,0.72) 0%, rgba(50,8,8,0.60) 50%, rgba(20,3,3,0.78) 100%)" }}
      />

      {/* ── Ambient radial glows ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 70%, rgba(242,98,35,0.18) 0%, transparent 70%)",
        }}
      />

      {/* ── Top edge fade ── */}
      <div
        className="absolute top-0 left-0 right-0 z-0 pointer-events-none"
        style={{
          height: 100,
          background: "linear-gradient(180deg, rgba(10,2,2,0.50) 0%, transparent 100%)",
        }}
      />

      {/* ── Horizontal image strip (decorative bg band) ── */}
      <div
        className="absolute left-0 right-0 pointer-events-none overflow-hidden"
        style={{
          top: "34%",
          transform: "translateY(-20%)",
          height: 300,
          zIndex: 1,
        }}
      >
        <Image
          src="/BG-ACCESS.png"
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.18, filter: "blur(2px) saturate(1.4)" }}
        />
        {/* left fade */}
        <div
          className="absolute inset-y-0 left-0 pointer-events-none"
          style={{
            width: "22%",
            background: "linear-gradient(to right, rgba(15,3,3,1) 0%, transparent 100%)",
          }}
        />
        {/* right fade */}
        <div
          className="absolute inset-y-0 right-0 pointer-events-none"
          style={{
            width: "22%",
            background: "linear-gradient(to left, rgba(15,3,3,1) 0%, transparent 100%)",
          }}
        />
        {/* top fade */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: "35%",
            background: "linear-gradient(to bottom, rgba(15,3,3,1) 0%, transparent 100%)",
          }}
        />
        {/* bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "35%",
            background: "linear-gradient(to top, rgba(15,3,3,1) 0%, transparent 100%)",
          }}
        />
        {/* center orange glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(180,50,10,0.30) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-20 mx-auto max-w-5xl w-full">



        {/* ── Heading ── */}
        <h2
          className="mb-3 text-center font-extrabold tracking-tight leading-none"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            background: "linear-gradient(170deg, #FFFFFF 0%, #F5C4A0 40%, #F26223 80%, #8B2810 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))",
          }}
        >
          Meet the Officers
        </h2>

        {/* ── Subtitle ── */}
        <p
          className="mb-16 text-center text-sm sm:text-base max-w-lg mx-auto leading-relaxed"
          style={{ color: "rgba(255,255,255,0.52)" }}
        >
          We are a community of student leaders and innovators committed to advancing technology,
          collaboration, and excellence within PUP.
        </p>

        {/* ── Carousel ── */}
        <div className="relative flex items-center justify-center">

          {/* Nav button – Left */}
          <button
            onClick={prev}
            aria-label="Previous officer"
            className="absolute left-0 z-20 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              color: "rgba(255,255,255,0.85)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
            }}
          >
            <ChevronLeft />
          </button>

          {/* Cards */}
          <div className="flex items-start justify-center gap-5 px-16 py-6">
            <OfficerCard {...MOCK_OFFICERS[leftIdx]}   featured={false} />
            <OfficerCard {...MOCK_OFFICERS[centerIdx]} featured={true}  />
            <OfficerCard {...MOCK_OFFICERS[rightIdx]}  featured={false} />
          </div>

          {/* Nav button – Right */}
          <button
            onClick={next}
            aria-label="Next officer"
            className="absolute right-0 z-20 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              color: "rgba(255,255,255,0.85)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
            }}
          >
            <ChevronRight />
          </button>
        </div>

        {/* ── Indicator strip ── */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {MOCK_OFFICERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to officer ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 28 : 8,
                height: 8,
                background: i === activeIndex
                  ? "linear-gradient(90deg, #F26223, #F5A070)"
                  : "rgba(255,255,255,0.2)",
                boxShadow: i === activeIndex ? "0 0 10px rgba(242,98,35,0.55)" : "none",
              }}
            />
          ))}
        </div>

        {/* ── Counter ── */}
        <p
          className="mt-4 text-center text-xs tabular-nums"
          style={{ color: "rgba(255,255,255,0.28)", letterSpacing: "0.12em" }}
        >
          {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </div>
    </section>
  )
}
