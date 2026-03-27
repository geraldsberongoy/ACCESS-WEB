import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Base /api endpoint hit!",
  });
}

export const dynamic = "force-dynamic";
