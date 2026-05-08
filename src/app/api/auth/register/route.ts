import { registerOrganization } from "@/features/auth/services/auth.services";
import { SignUpSchema } from "@/features/auth/schemas";
import { AppError } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate 
    const validatedData = SignUpSchema.safeParse(body);
    if (!validatedData.success) {
      const errorMsg = validatedData.error.issues
        .map((issue) => issue.message)
        .join(", ");
        
      throw new AppError(errorMsg, 400);
    }

    // Pass the clean data to the service
    const result = await registerOrganization(validatedData.data);
    

    return NextResponse.json(result);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    
    // Fallback for internal crashes (500)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}