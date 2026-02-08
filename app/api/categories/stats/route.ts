import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/lib/api/categories";
import { requireAdminSession } from "@/lib/auth-api";

export async function GET(request: NextRequest) {
  const authError = await requireAdminSession(request);
  if (authError) return authError;
  try {
    const stats = await categoryService.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching category stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch category stats" },
      { status: 500 }
    );
  }
}
