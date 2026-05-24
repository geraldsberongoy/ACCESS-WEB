"use client";

import AuthScreenLayout from "@/features/auth/components/AuthScreenLayout";
import { LogInForm } from "@/features/auth/components/LogInForm";

export default function LoginScreen() {
  return (
    <AuthScreenLayout title="Log In Account">
      <LogInForm />
    </AuthScreenLayout>
  );
}
