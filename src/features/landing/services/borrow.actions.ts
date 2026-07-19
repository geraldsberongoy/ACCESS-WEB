"use server";

import { revalidatePath } from "next/cache";
import { BorrowRequestSchema } from "@/features/cms/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

type ActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

function toDateTime(
  date: string,
  hour: string,
  minute: string,
  period: string
): Date {
  let h = parseInt(hour, 10);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d, h, parseInt(minute, 10));
}

export async function submitBorrowRequestAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { status: "error", message: "You must sign in to submit a borrow request." };
    }

    const { data: userRow, error: userError } = await supabase
      .from("Users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (userError) throw userError;

    if (!userRow?.role || !["Organization", "Default"].includes(userRow.role)) {
      return {
        status: "error",
        message: "Your account is not authorized to submit borrow requests.",
      };
    }

    const parsed = BorrowRequestSchema.safeParse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      courseYearSection: formData.get("courseYearSection"),
      contactNumber: formData.get("contactNumber"),
      organization: formData.get("organization"),
      purpose: formData.get("purpose"),
      additionalInfo: formData.get("additionalInfo") || "",
      item: formData.get("item"),
      startDate: formData.get("startDate"),
      startHour: formData.get("startHour"),
      startMinute: formData.get("startMinute"),
      startPeriod: formData.get("startPeriod"),
      endDate: formData.get("endDate"),
      endHour: formData.get("endHour"),
      endMinute: formData.get("endMinute"),
      endPeriod: formData.get("endPeriod"),
    });

    if (!parsed.success) {
      return {
        status: "error",
        message: parsed.error.issues.map((i) => i.message).at(0) ?? "Invalid input",
      };
    }

    const letterFile = formData.get("letterFile");
    if (!(letterFile instanceof File) || letterFile.size === 0) {
      return { status: "error", message: "Request letter file is required." };
    }

    const start = toDateTime(
      parsed.data.startDate,
      parsed.data.startHour,
      parsed.data.startMinute,
      parsed.data.startPeriod
    );
    const end = toDateTime(
      parsed.data.endDate,
      parsed.data.endHour,
      parsed.data.endMinute,
      parsed.data.endPeriod
    );

    if (end <= start) {
      return { status: "error", message: "End date and time must be after the start." };
    }

    const ext = letterFile.name.split(".").pop() ?? "pdf";
    const filePath = `borrow-letters/${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("access_web_assets")
      .upload(filePath, letterFile, {
        contentType: letterFile.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("access_web_assets")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("BorrowRequests").insert({
      user_id: user.id,
      borrower_contact_name: parsed.data.fullName,
      borrower_email: parsed.data.email,
      borrower_phone: parsed.data.contactNumber,
      course_year_section: parsed.data.courseYearSection,
      organization_name: parsed.data.organization,
      purpose: parsed.data.purpose,
      additional_info: parsed.data.additionalInfo || null,
      requested_item: parsed.data.item,
      requested_start_date: start.toISOString(),
      requested_end_date: end.toISOString(),
      letter_file_url: publicUrlData.publicUrl,
      status: "Pending",
    });

    if (insertError) throw insertError;

    revalidatePath("/admin/borrow-requests");
    revalidatePath("/admin");

    return { status: "success" };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Failed to submit borrow request",
    };
  }
}
