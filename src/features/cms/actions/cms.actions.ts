"use server";

import { revalidatePath } from "next/cache";
import {
  AboutContentSchema,
  HeroContentSchema,
  OfficersSectionContentSchema,
} from "../schemas";
import {
  updateSiteContent,
  uploadSiteContentImage,
} from "../services/site-content.service";
import {
  createFAQItem,
  deleteFAQItem,
  updateFAQItem,
} from "../services/faq.service";
import { markContactMessageRead } from "../services/contact-messages.service";
import { FAQItemSchema, UpdateFAQItemSchema } from "../schemas";

type ActionState =
  | { status: "idle" }
  | { status: "success"; message?: string }
  | { status: "error"; message: string };

export async function updateHeroContentAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const titleLines = [
      formData.get("titleLine1"),
      formData.get("titleLine2"),
      formData.get("titleLine3"),
    ]
      .filter((line): line is string => typeof line === "string" && line.trim().length > 0)
      .map((line) => line.trim());

    const parsed = HeroContentSchema.safeParse({
      titleLines,
      subtitle: formData.get("subtitle"),
      primaryCtaLabel: formData.get("primaryCtaLabel"),
      secondaryCtaLabel: formData.get("secondaryCtaLabel"),
    });

    if (!parsed.success) {
      return {
        status: "error",
        message: parsed.error.issues.map((i) => i.message).at(0) ?? "Invalid input",
      };
    }

    await updateSiteContent("hero", parsed.data);
    revalidatePath("/", "layout");
    revalidatePath("/admin/content/landing");

    return { status: "success", message: "Landing content updated." };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Failed to update landing content",
    };
  }
}

export async function updateAboutContentAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const parsed = AboutContentSchema.safeParse({
      title: formData.get("title"),
      body: formData.get("body"),
    });

    if (!parsed.success) {
      return {
        status: "error",
        message: parsed.error.issues.map((i) => i.message).at(0) ?? "Invalid input",
      };
    }

    await updateSiteContent("about", parsed.data);
    revalidatePath("/", "layout");
    revalidatePath("/admin/content/about");

    return { status: "success", message: "About content updated." };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Failed to update about content",
    };
  }
}

export async function updateOfficersSectionAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const templateFile = formData.get("templateImage");
    let templateImageUrl =
      typeof formData.get("templateImageUrl") === "string"
        ? (formData.get("templateImageUrl") as string)
        : "/meet-the-officers.webp";

    if (templateFile instanceof File && templateFile.size > 0) {
      templateImageUrl = await uploadSiteContentImage(templateFile);
    }

    const parsed = OfficersSectionContentSchema.safeParse({
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      templateImageUrl,
    });

    if (!parsed.success) {
      return {
        status: "error",
        message: parsed.error.issues.map((i) => i.message).at(0) ?? "Invalid input",
      };
    }

    await updateSiteContent("officers_section", parsed.data);
    revalidatePath("/", "layout");
    revalidatePath("/admin/content/officers-template");

    return { status: "success", message: "Officers section updated." };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Failed to update officers section",
    };
  }
}

export async function createFAQAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const parsed = FAQItemSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        status: "error",
        message: parsed.error.issues.map((i) => i.message).at(0) ?? "Invalid input",
      };
    }

    await createFAQItem(parsed.data);
    revalidatePath("/", "layout");
    revalidatePath("/admin/content/faqs");

    return { status: "success", message: "FAQ created." };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Failed to create FAQ",
    };
  }
}

export async function updateFAQAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const raw = Object.fromEntries(formData);
    const parsed = UpdateFAQItemSchema.safeParse({
      ...raw,
      is_active: raw.is_active === "true",
    });

    if (!parsed.success) {
      return {
        status: "error",
        message: parsed.error.issues.map((i) => i.message).at(0) ?? "Invalid input",
      };
    }

    const { id, ...updates } = parsed.data;
    await updateFAQItem(id, updates);
    revalidatePath("/", "layout");
    revalidatePath("/admin/content/faqs");

    return { status: "success", message: "FAQ updated." };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Failed to update FAQ",
    };
  }
}

export async function deleteFAQAction(
  _prevState: ActionState,
  id: string
): Promise<ActionState> {
  try {
    await deleteFAQItem(id);
    revalidatePath("/", "layout");
    revalidatePath("/admin/content/faqs");

    return { status: "success", message: "FAQ deleted." };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Failed to delete FAQ",
    };
  }
}

export async function markContactMessageReadAction(id: string): Promise<ActionState> {
  try {
    await markContactMessageRead(id);
    revalidatePath("/admin/contact-messages");
    revalidatePath("/admin");

    return { status: "success" };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Failed to mark message as read",
    };
  }
}
