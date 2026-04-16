"use client";

export function ForgotPasswordForm() {

  async function handleRequest(formData: FormData) {
    const email = formData.get("email");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (res.ok) alert("Check your email for the reset link!");
    else alert("Error sending reset link.");
  };

  return (
    <form action={handleRequest} className="flex flex-col gap-4">
      <input name="email" type="email" placeholder="Enter your email" required />
      <button type="submit">Send Reset Link</button>
    </form>
  );
}