"use client";

export function ResetPasswordForm() {

  async function handleReset(formData: FormData) {
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ password, confirmPassword }),
    });

    if (res.ok) window.location.href = "/auth/login?reset=success";
    else alert("Failed to update password.");
  };

  return (
    <form action={handleReset} className="flex flex-col gap-4">
      <input name="password" type="password" placeholder="New Password" required />
      <input name="confirmPassword" type="password" placeholder="Confirm New Password" required />
      <button type="submit">Update Password</button>
    </form>
  );
}