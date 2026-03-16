"use client"

import Image from "next/image"
import CrystalDice3D, { CrystalConfig } from "@/components/ui/CrystalDice3D"

interface Contributor {
  name: string
  role: string
  image: string
}

const CONTRIBUTOR_CRYSTALS: CrystalConfig[] = [
  { x: -7.0, y: 5.2, z: 0.5, size: 2.0, hue: 0.02, sx: 0.003, sy: 0.004, sz: 0.002, fa: 0.32, fs: 0.45, phase: 0.0 },
  { x: 6.8, y: -4.8, z: 0.5, size: 2.5, hue: 0.01, sx: 0.005, sy: 0.003, sz: 0.004, fa: 0.20, fs: 0.70, phase: 1.4 },
  { x: 6.0, y: 4.5, z: 1.5, size: 1.5, hue: 0.01, sx: 0.003, sy: 0.004, sz: 0.003, fa: 0.35, fs: 0.50, phase: 1.8 },
  { x: -5.5, y: -3.8, z: -1.2, size: 1.2, hue: 0.00, sx: 0.007, sy: 0.003, sz: 0.005, fa: 0.18, fs: 0.90, phase: 0.8 },
]

const MOCK_CONTRIBUTORS: Contributor[] = Array(6).fill({
  name: "Antonio Mickel\nTantia",
  role: "Control Officer",
  image: "/BG-ACCESS.png",
})

export default function ContributorsSection() {
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
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(242,98,35,0.2) 0%, transparent 70%)",
        }}
      />

      {/* ── Crystal dice (scattered, z-index 1) ── */}
      <CrystalDice3D crystals={CONTRIBUTOR_CRYSTALS} cameraZ={13} className="z-[1]" />

      {/* ── Content ── */}
      <div className="relative z-20 mx-auto max-w-7xl w-full flex flex-col items-center">
        
        {/* Title */}
        <h2 
          className="mb-6 text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-widest drop-shadow-xl title-header"
          style={{
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
             backgroundClip: 'text',
          }}
        >
          The Minds Behind the Work
        </h2>
        
        {/* Subtitle */}
        <div className="mb-10 text-center text-xs sm:text-sm md:text-base max-w-3xl mx-auto leading-loose text-white font-medium relative flex flex-col items-center gap-2">
          <span className="relative inline-block pb-1 px-2">
            Recognizing the individuals whose dedication and collaboration made this project possible. Together, their work shaped the outcome of this project.
          </span>
            
        </div>

        {/* Second Title */}
        <h3 
          className="mb-12 text-center text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-widest title-header"
          style={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Contributors
        </h3>

        {/* Cards Wrapper */}
        <div className="flex flex-wrap justify-center items-center gap-0 w-full" style={{ gap: '6px' }}>
          {MOCK_CONTRIBUTORS.map((contributor, idx) => (
            <div key={idx} className="flex flex-col items-center flex-shrink-0 mb-6 sm:mb-0">
              {/* Skewed Container */}
              <div 
                className="relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 z-10"
                style={{
                  width: '160px',
                  height: '340px',
                  transform: 'skewX(-11deg)',
                  background: '#140502',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              >
                {/* Content un-skewed */}
                <div 
                  className="absolute inset-0 flex flex-col justify-end"
                  style={{ transform: 'skewX(11deg) scale(1.18)', transformOrigin: 'center' }}
                >
                  <div className="absolute inset-0 bg-black" />
                
                  
                  {/* Person Photo */}
                  <div className="absolute inset-0 z-10 flex justify-center items-end pb-[10%]">
                     <Image 
                        src={contributor.image} 
                        alt={contributor.name} 
                        fill
                        className="object-cover object-[center_top] opacity-95"
                     />
                  </div>

                  {/* Alternating Skewed Gradient */}
                  <div 
                    className="absolute z-20 pointer-events-none" 
                    style={{
                      left: '-20%', right: '-20%', top: '-20%', bottom: '-20%',
                      background: idx % 2 === 0
                        ? 'linear-gradient(to top, rgba(230,80,20,1) 0%, rgba(230,80,20,0.85) 15%, transparent 55%)'
                        : 'linear-gradient(to bottom, rgba(230,80,20,1) 0%, rgba(230,80,20,0.85) 15%, transparent 55%)',
                      transform: 'skewY(-11deg)'
                    }}
                  />

                  {/* Name */}
                  <div className="relative z-30 pb-9 pr-10 w-full text-center">
                    <p className="font-bold text-white text-sm leading-tight drop-shadow-md px-2">
                       {contributor.name.split('\n').map((line, i) => (
                        <span key={i} className="block">{line}</span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Role Text Below */}
              <div className="mt-4 text-center pr-15">
                <p className="font-bold text-sm tracking-wide" style={{ color: "#E3835B" }}>
                  {contributor.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
