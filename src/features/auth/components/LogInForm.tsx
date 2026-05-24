"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signInAction } from "../actions/auth.actions";

export function LogInForm() {
  const [state, formAction, isPending] = useActionState(signInAction, { status: "idle" });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="w-full space-y-5">
      {state.status === "error" && (
        <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-300">{state.message}</p>
      )}

      <div>
        <input
          type="text"
          id="email"
          name="email"
          required
          placeholder="Student Number"
          autoComplete="username"
          className="w-full rounded-xl border-0 bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#F26223]/60"
        />
      </div>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          required
          placeholder="Password"
          autoComplete="current-password"
          className="w-full rounded-xl border-0 bg-white px-4 py-3.5 pr-12 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#F26223]/60"
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
        {isPending ? "Loading..." : "Log in"}
      </button>

      <div className="flex items-center justify-between gap-3 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-white/85">
          <input
            type="checkbox"
            name="remember"
            className="h-4 w-4 rounded border-white/30 bg-transparent accent-[#F26223]"
          />
          Remember me
        </label>
        <Link href="/auth/forgot-password" className="font-medium text-[#F26223] hover:text-[#ff7a3d]">
          Forgot Password
        </Link>
      </div>

      <div className="relative py-1">
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
        <p className="relative mx-auto w-fit bg-[#141414] px-3 text-xs text-white/60">
          Don&apos;t have an account?
        </p>
      </div>

      <Link
        href="/auth/register"
        className="flex w-full items-center justify-center rounded-xl bg-black px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black/80"
      >
        Sign up
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
