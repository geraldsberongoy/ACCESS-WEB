"use client";

import { LogInForm } from "@/features/auth/components/LogInForm";
import { LOGIN_SLIDE_INTERVAL_MS, LOGIN_SLIDES } from "@/features/auth/constants/login-slides";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function LoginScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex((index + LOGIN_SLIDES.length) % LOGIN_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % LOGIN_SLIDES.length);
    }, LOGIN_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {LOGIN_SLIDES.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 bg-black/50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />

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

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-20">
        <div
          className="w-full max-w-md rounded-3xl px-6 py-8 sm:px-8 sm:py-10"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-wide title-header sm:text-3xl">
              Sign In
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Welcome to ACCESS-WEB, please sign in to your account.
            </p>
          </div>

          <div className="mt-8">
            <LogInForm />
          </div>

          <div className="mt-6 space-y-2 text-center text-sm text-white/75">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-medium text-white underline">
                Sign Up
              </Link>
            </p>
            <p>
              <Link href="/" className="font-medium text-white/85 underline">
                Sign In as Guest
              </Link>
            </p>
            <p>
              <Link href="/auth/forgot-password" className="font-medium text-white/85 underline">
                Forgot Password
              </Link>
            </p>
            <p>
              <Link href="/auth" className="font-medium text-white/85 underline">
                Back
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
        {LOGIN_SLIDES.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? "scale-110 bg-white" : "bg-white/35 hover:bg-white/55"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
