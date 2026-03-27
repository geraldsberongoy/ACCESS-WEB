import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await context.params;

  return NextResponse.json({
    message: "Dynamic API route hit!",
    params: slug || [],
  });
}

export const dynamic = "force-dynamic";
