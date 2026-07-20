import { logOutService } from "@/features/auth/services/auth.services";
import { toErrorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await logOutService();
    return NextResponse.json({ message: "Logged out successfully" });

  } catch (err: unknown) {
    return toErrorResponse(err);
  }
}
