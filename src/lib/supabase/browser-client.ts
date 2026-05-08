"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Singleton instance of the Supabase Browser Client.
 * Using a singleton prevents creating multiple connection instances 
 * during React re-renders in the browser.
 */
let client: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (client) {
    return client;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

// Initializing client with generated Database types for IntelliSense
  client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  return client;
}