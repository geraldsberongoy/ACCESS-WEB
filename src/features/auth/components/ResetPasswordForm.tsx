"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "../actions/auth.actions";

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, { status: "idle" });
    const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      const timer = setTimeout(() => router.push("/auth/login"), 3000); 
      return () => clearTimeout(timer);
    }
  }, [router, state.status]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input name="password" type="password" placeholder="New Password" required />
      <input name="confirmPassword" type="password" placeholder="Confirm New Password" required />
      {state.status === "error" && <p className="text-red-500">{state.message}</p>}
      {state.status === "success" && <p className="text-green-500">Password reset successful! Redirecting you shortly...</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}