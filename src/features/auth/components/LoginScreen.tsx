"use client";

import { LogInForm } from "@/features/auth/components/LogInForm";
import Image from "next/image";
import Link from "next/link";

export default function LoginScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <Image src="/LogInBG/BG1.png" alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 18% 50%, rgba(220, 40, 30, 0.45) 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 85% 50%, rgba(242, 98, 35, 0.15) 0%, transparent 60%)",
        }}
      />

      <Link href="/" className="absolute left-5 top-5 z-20 sm:left-8 sm:top-8">
        <Image
          src="/AccessLogo.webp"
          alt="ACCESS"
          width={120}
          height={36}
          className="h-8 w-auto object-contain sm:h-9"
          priority
        />
      </Link>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20 sm:px-6">
        <div
          className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 lg:grid-cols-[1fr_1fr]"
          style={{
            background: "rgba(12, 12, 12, 0.88)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.55)",
          }}
        >
          {/* Form panel */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
            <h1 className="text-2xl font-bold text-white sm:text-[1.75rem]">Log In Account</h1>
            <div className="mt-8">
              <LogInForm />
            </div>
            <p className="mt-6 text-center text-sm">
              <Link href="/auth" className="text-white/60 underline-offset-2 hover:text-white hover:underline">
                Back
              </Link>
            </p>
          </div>

          {/* Emblem panel */}
          <div className="relative hidden min-h-[420px] items-center justify-center overflow-hidden border-l border-white/10 bg-black/30 lg:flex">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(242, 98, 35, 0.25) 0%, transparent 70%)",
              }}
            />
            <Image
              src="/AccessLogo.png"
              alt="ACCESS emblem"
              width={360}
              height={360}
              className="relative z-10 h-auto w-[min(85%,320px)] object-contain drop-shadow-[0_12px_40px_rgba(242,98,35,0.35)]"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
