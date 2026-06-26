"use client";

import { Navbar } from "@/components/ui";
import ContactUsForm from "@/features/landing/components/ContactUsForm";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col bg-black overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 85% 90%, rgba(242,98,35,0.45) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 10% 20%, rgba(134,37,32,0.35) 0%, transparent 55%)",
        }}
      />

      <Navbar />

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
        <ContactUsForm onBack={() => router.push("/")} />
      </main>
    </div>
  );
}
