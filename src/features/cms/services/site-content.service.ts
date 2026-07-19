import { createSupabaseServerClient } from "@/lib/supabase/server-client";
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
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("SiteContent")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error || !data?.value) {
      return fallback;
    }

    const parsed = schema.safeParse(data.value);
    return parsed.success && parsed.data ? parsed.data : fallback;
  } catch {
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
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("SiteContent").upsert(
    {
      key,
      value,
      updated_by: user?.id ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) throw error;
}

export async function uploadSiteContentImage(file: File): Promise<string> {
  await checkRole({ roles: "Admin" });
  const supabase = await createSupabaseServerClient();

  const ext = file.name.split(".").pop() ?? "png";
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = `site-content/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("access_web_assets")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("access_web_assets").getPublicUrl(filePath);
  return data.publicUrl;
}
