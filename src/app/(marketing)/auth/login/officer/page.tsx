import { LogInForm } from "@/features/auth/components/LogInForm";
import Image from "next/image";
import Link from "next/link";

export default function OfficerLoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <Image
        src="/LogInBG/BG2.JPG"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />

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
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-black/60 p-8 backdrop-blur-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Officer Sign In</h1>
            <p className="mt-2 text-sm text-white/70">
              Welcome to ACCESS-WEB. Please sign in to your officer account.
            </p>
          </div>

          <LogInForm />

          <div className="space-y-2 text-center text-sm">
            <p className="text-white/70">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-medium text-white underline">
                Sign Up
              </Link>
            </p>
            <p>
              <Link href="/auth/login" className="font-medium text-white/80 underline">
                Back to role selection
              </Link>
            </p>
            <p>
              <Link href="/auth/forgot-password" className="font-medium text-white/80 underline">
                Forgot Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
