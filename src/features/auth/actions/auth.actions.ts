"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import { logInService, logOutService, registerOrganization } from "../services/auth.services";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await logInService({email, password});
  } catch (err: unknown) {
    const errorMessage = err instanceof Error
    ? err. message
    : "An unexpected error occured";

    return { error: errorMessage }
  }

  revalidatePath("/", "layout");
  redirect("/")
}

export const signUp = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const organizationName = formData.get("organization_name") as string;

  try {
    await registerOrganization({
      email,
      password,
      organizationName,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error 
      ? err.message 
      : "An unexpected error occurred";

    return { error: errorMessage };
  }

  revalidatePath("/", "layout");
  redirect("/");
};

export const signOut = async () => {
  try {
    await logOutService();
  } catch (error) {
    // We usually don't block the user from redirecting even if 
    // the server-side sign-out has a hiccup, but we log it.
    console.error("Sign out error:", error);
  }

  // Clear cache and send them back to login
  revalidatePath("/", "layout");
  redirect("/auth/login");
};
