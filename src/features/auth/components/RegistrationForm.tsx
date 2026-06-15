"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpAction } from "../actions/auth.actions";

const inputClassName =
  "w-full rounded-xl border-0 bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#F26223]/60";

export function RegistrationForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, { status: "idle" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      const timer = setTimeout(() => router.push("/auth/login"), 3000);
      return () => clearTimeout(timer);
    }
  }, [router, state.status]);

  return (
    <form action={formAction} className="w-full space-y-5">
      {state.status === "error" && (
        <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-300">{state.message}</p>
      )}
      {state.status === "success" && (
        <p className="rounded-xl bg-green-500/15 px-4 py-3 text-sm text-green-300">
          Account created! Check your email to confirm, redirecting you shortly...
        </p>
      )}

      <input
        type="text"
        id="organization_name"
        name="organization_name"
        required
        placeholder="Organization Name"
        autoComplete="organization"
        className={inputClassName}
      />

      <input
        type="email"
        id="email"
        name="email"
        required
        placeholder="Email"
        autoComplete="email"
        className={inputClassName}
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          required
          placeholder="Password"
          autoComplete="new-password"
          className={`${inputClassName} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: "linear-gradient(180deg, #F26223 0%, #C93A12 100%)",
          boxShadow: "0 6px 20px rgba(242, 98, 35, 0.35)",
        }}
      >
        {isPending ? "Loading..." : "Sign up"}
      </button>

      <div className="relative py-1">
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
        <p className="relative mx-auto w-fit px-3 text-xs text-white/60 backdrop-blur-sm">
          Already have an account?
        </p>
      </div>

      <Link
        href="/auth/login"
        className="flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/15"
      >
        Log in
      </Link>
    </form>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
