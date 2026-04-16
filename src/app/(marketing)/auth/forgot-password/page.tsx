import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Forgot Password | ACCESS Web Portal",
  description: "Request a password reset link for your ACCESS account.",
};

export default async function ForgotPasswordPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // Check if user is logged-in
  if (!user || error) {
    redirect("/auth/login?error=unauthorized");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black-50 p-4">
      <div className="w-full max-w-md p-8 bg-black rounded-xl shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter your email and we&#39ll send you a link to get back into your account.
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="mt-6 text-center">
          <Link 
            href="/auth/login" 
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}