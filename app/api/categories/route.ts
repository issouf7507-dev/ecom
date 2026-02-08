import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/lib/api/categories";
import { Status } from "@/lib/constants/status";
import { rateLimitResponse } from "@/lib/rate-limit";
import { requireAdminSession } from "@/lib/auth-api";

const GET_RATE = { limit: 120, windowMs: 60 * 1000 };
const POST_RATE = { limit: 30, windowMs: 60 * 1000 };

export async function GET(request: NextRequest) {
  const rateLimited = rateLimitResponse(request, GET_RATE);
  if (rateLimited) return rateLimited;

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as Status | null;
    const search = searchParams.get("search") || undefined;
    const parentId = searchParams.get("parentId") || undefined;

    const filters = {
      ...(status && status !== Status.ACTIVE && { status }),
      ...(search && { search }),
      ...(parentId !== undefined && {
        parentId: parentId === "null" ? null : parentId,
      }),
    };

    const categories = await categoryService.getAllCategories(filters);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminSession(request);
  if (authError) return authError;
  const rateLimited = rateLimitResponse(request, POST_RATE);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const category = await categoryService.createCategory(body);

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 400 }
    );
  }
}
