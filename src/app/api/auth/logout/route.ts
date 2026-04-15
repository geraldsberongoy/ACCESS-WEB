import { logOutService } from "@/features/auth/services/auth.services";
import { AppError } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await logOutService();
    return NextResponse.json({ message: "Logged out successfully" });

  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
