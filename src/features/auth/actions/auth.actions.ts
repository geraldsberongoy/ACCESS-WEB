"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {createSupabaseServerClient} from "@/lib/supabase/server-client";

export const signIn = async (formData: FormData) => {
    const supabase = await createSupabaseServerClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return {error: error.message};
    }

    // If there's already an existing cached data, should return to landing page
    revalidatePath("/", "layout");
    redirect("/")
}

export const signUp = async (formData: FormData) => {
    const supabase = await createSupabaseServerClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        options: {
            data: {
                organization_name: formData.get("organization_name")
            }
        }
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        return {error: error.message};
    }

    // If there's already an existing cached data, should return to landing page
    revalidatePath("/", "layout");
    redirect("/")
}

export const signOut = async () => {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/auth/login")
}
