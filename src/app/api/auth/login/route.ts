import { logInService } from "@/features/auth/services/auth.services";
import { LoginSchema } from "@/features/auth/schemas";
import { AppError, toErrorResponse } from "@/lib/errors";
import { NextResponse } from "next/server";

// Note: rate limitting is handled by supabase internally
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate 
    const validatedData = LoginSchema.safeParse(body);
    if (!validatedData.success) {
      const errorMsg = validatedData.error.issues
        .map((issue) => issue.message)
        .join(", ");
        
      throw new AppError(errorMsg, 400);
    }

    // Pass the clean data to the service
    const result = await logInService(validatedData.data);
    
    return NextResponse.json(result);
  } catch (err: unknown) {
    return toErrorResponse(err);
  }
}