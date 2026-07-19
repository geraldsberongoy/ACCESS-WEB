import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

function assertServiceRoleKey(key: string) {
  const payloadPart = key.split(".")[1];
  if (!payloadPart) {
    throw new Error("Invalid SUPABASE_SERVICE_ROLE_KEY format.");
  }

  const payload = JSON.parse(
    Buffer.from(payloadPart, "base64url").toString("utf8")
  ) as { role?: string };

  if (payload.role !== "service_role") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY must be the service_role secret from Supabase Dashboard > Project Settings > API, not the anon key."
    );
  }
}

export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Restart the dev server after updating .env.local."
    );
  }

  assertServiceRoleKey(serviceRoleKey);

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
