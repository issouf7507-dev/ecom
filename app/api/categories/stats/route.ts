import { NextResponse } from "next/server";
import { categoryService } from "@/lib/api/categories";

export async function GET() {
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
