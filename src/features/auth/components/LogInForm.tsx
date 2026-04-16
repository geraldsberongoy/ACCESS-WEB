"use client";

import { useActionState } from "react";
import { signInAction } from "../actions/auth.actions";

export function LogInForm() {
  const [state, formAction, isPending] = useActionState(signInAction, { status: "idle" });

  return (
    <form action={formAction} className="w-full space-y-4">
      {state.status === "error" && <p className="rounded-lg border border-red-200 bg-red-950 text-sm 
          text-red-400 p-3">{state.message}</p>}

      <div>
          <label
            htmlFor="name"
            className="text-gray-300 text-sm font-medium mb-2 block">
            Email
          </label>
          <input 
            type="email"
            id="email"
            name="email"
            required
            className="w-full bg-gray-900 border border-gray-700 px-4 py-3 placeholder-gray-50 transition-colors focus:border-black focus:outline-none rounded-lg text-white"
            placeholder="Enter your email..."
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor="name"
            className="text-gray-300 text-sm font-medium mb-2 block">
            Password
          </label>
          <input 
            type="password"
            id="password"
            name="password"
            required
            className="w-full bg-gray-900 border border-gray-700 px-4 py-3 placeholder-gray-50 transition-colors focus:border-black focus:outline-none rounded-lg text-white"
            placeholder="Enter your password..."
            autoComplete="off"
          />
        </div>

        <button type="submit" disabled={isPending} className="w-full rounded-lg text-black bg-white px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">{isPending ? 'Loading...' : "Sign In"}</button>
    </form>
  );
};