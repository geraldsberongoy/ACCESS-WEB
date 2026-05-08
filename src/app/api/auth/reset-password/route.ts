import { ResetPasswordSchema } from "@/features/auth/schemas";
import { resetPasswordService } from "@/features/auth/services/auth.services";
import { AppError } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = ResetPasswordSchema.parse(body);
    const result = await resetPasswordService(password);
    
    return NextResponse.json(result);

  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}