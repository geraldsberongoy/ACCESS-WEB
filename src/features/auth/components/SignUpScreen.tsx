"use client";

import AuthScreenLayout from "@/features/auth/components/AuthScreenLayout";
import { RegistrationForm } from "@/features/auth/components/RegistrationForm";

export default function SignUpScreen() {
  return (
    <AuthScreenLayout title="Sign Up Account">
      <RegistrationForm />
    </AuthScreenLayout>
  );
}
