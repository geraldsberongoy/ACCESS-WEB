import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { SignUpInput, LoginInput } from "../schemas";
import { AppError } from "@/lib/errors";

export async function registerOrganization(input: SignUpInput) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password!,
    options: {
      data: {
        organization_name: input.organizationName,
      },
    },
  });

  if (error) throw new AppError(error.message, error.status);
  
  return data;
}

export async function logInService(input: LoginInput) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password!,
  });

  if (error) throw new AppError(error.message, error.status);

  return data;
}

export async function logOutService() {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase.auth.signOut();

  if (error) throw new AppError(error.message, 500);
}

export async function forgotPasswordService(email: string) {
  const supabase = await createSupabaseServerClient();
  
  // redirectTo must be added to Supabase Auth Allow List
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/reset-password`,
  });

  if (error) throw new AppError(error.message, error.status);
  return { success: true };
}

export async function resetPasswordService(password: string) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase.auth.updateUser({ password });

  if (error) throw new AppError(error.message, error.status);
  return { success: true };
}