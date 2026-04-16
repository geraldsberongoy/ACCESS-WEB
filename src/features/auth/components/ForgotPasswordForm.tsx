"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "../actions/auth.actions";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, { status: "idle" });
  
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input name="email" type="email" placeholder="Enter your email" required />
      {state.status === "error" && <p className="text-red-500">{state.message}</p>}
      {state.status === "success" && <p className="text-green-500">Check your email for the reset link!</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}