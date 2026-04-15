import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { AppError } from "@/lib/errors";

export type SignUpInput = {
  email: string;
  password: string; 
  organizationName: string;
};

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

export type SignInInput = {
  email: string;
  password: string;
};

export async function logInService(input: SignInInput) {
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