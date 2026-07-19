import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { throwSupabaseError } from "@/lib/errors";
import { checkRole } from "@/utils/checkRole";
import {
  AboutContentSchema,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_HERO_CONTENT,
  DEFAULT_OFFICERS_SECTION_CONTENT,
  HeroContentSchema,
  OfficersSectionContentSchema,
  type AboutContent,
  type HeroContent,
  type OfficersSectionContent,
} from "../schemas";

type SiteContentKey = "hero" | "about" | "officers_section";

async function getContentByKey<T>(
  key: SiteContentKey,
  schema: { safeParse: (data: unknown) => { success: boolean; data?: T } },
  fallback: T
): Promise<T> {
  noStore();

  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("SiteContent")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      console.error(`[SiteContent] Failed to read "${key}":`, error.message);
      return fallback;
    }

    if (!data?.value) {
      return fallback;
    }

    const parsed = schema.safeParse(data.value);
    if (!parsed.success || !parsed.data) {
      console.error(`[SiteContent] Invalid stored value for "${key}"`);
      return fallback;
    }

    return parsed.data;
  } catch (error) {
    console.error(`[SiteContent] Unexpected read error for "${key}":`, error);
    return fallback;
  }
}

export async function getHeroContent(): Promise<HeroContent> {
  return getContentByKey("hero", HeroContentSchema, DEFAULT_HERO_CONTENT);
}

export async function getAboutContent(): Promise<AboutContent> {
  return getContentByKey("about", AboutContentSchema, DEFAULT_ABOUT_CONTENT);
}

export async function getOfficersSectionContent(): Promise<OfficersSectionContent> {
  return getContentByKey(
    "officers_section",
    OfficersSectionContentSchema,
    DEFAULT_OFFICERS_SECTION_CONTENT
  );
}

export async function updateSiteContent(
  key: SiteContentKey,
  value: HeroContent | AboutContent | OfficersSectionContent
) {
  await checkRole({ roles: "Admin" });
  const supabase = createSupabaseAdminClient();
  const serverSupabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  const updatePayload = {
    value,
    updated_by: user?.id ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data: existing, error: readError } = await supabase
    .from("SiteContent")
    .select("key")
    .eq("key", key)
    .maybeSingle();

  throwSupabaseError(readError);

  const mutation = existing
    ? supabase.from("SiteContent").update(updatePayload).eq("key", key).select("key, value").single()
    : supabase.from("SiteContent").insert({ key, ...updatePayload }).select("key, value").single();

  const { data: saved, error } = await mutation;
  throwSupabaseError(error);

  if (!saved?.value) {
    throw new Error(`Site content "${key}" was not saved.`);
  }

  return saved;
}

export async function uploadSiteContentImage(file: File): Promise<string> {
  await checkRole({ roles: "Admin" });
  const supabase = createSupabaseAdminClient();

  const ext = file.name.split(".").pop() ?? "png";
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = `site-content/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("access_web_assets")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("access_web_assets").getPublicUrl(filePath);
  return data.publicUrl;
}
