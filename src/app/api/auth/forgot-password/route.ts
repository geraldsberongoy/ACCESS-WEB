import { ForgotPasswordSchema } from "@/features/auth/schemas";
import { forgotPasswordService } from "@/features/auth/services/auth.services";
import { toErrorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = ForgotPasswordSchema.parse(body);
    const result = await forgotPasswordService(email);
    
    return NextResponse.json(result);

  } catch (err: unknown) {
    return toErrorResponse(err);
  }
}