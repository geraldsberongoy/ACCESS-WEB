"use server";

import { revalidatePath } from "next/cache";
import { ContactMessageSchema } from "@/features/cms/schemas";
import { submitContactMessage } from "@/features/cms/services/contact-messages.service";
import { getErrorMessage } from "@/lib/errors";

type ActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function submitContactMessageAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const parsed = ContactMessageSchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      courseYearSection: formData.get("courseYearSection"),
      contactNumber: formData.get("contactNumber"),
      organization: formData.get("organization"),
      purpose: formData.get("purpose"),
      concern: formData.get("concern"),
    });

    if (!parsed.success) {
      return {
        status: "error",
        message: parsed.error.issues.map((i) => i.message).at(0) ?? "Invalid input",
      };
    }

    await submitContactMessage({
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      course_year_section: parsed.data.courseYearSection,
      contact_number: parsed.data.contactNumber,
      organization: parsed.data.organization,
      purpose: parsed.data.purpose,
      concern: parsed.data.concern,
    });

    revalidatePath("/admin/contact-messages");
    revalidatePath("/admin");

    return { status: "success" };
  } catch (err) {
    return {
      status: "error",
      message: getErrorMessage(err, "Failed to submit message"),
    };
  }
}
