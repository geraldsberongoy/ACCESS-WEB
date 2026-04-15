import { registerOrganization } from "@/features/auth/services/auth.services";
import { AppError } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const result = await registerOrganization(await req.json());
    return NextResponse.json(result);
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    
    // Fallback for internal crashes (500)
    console.error(err); 
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}