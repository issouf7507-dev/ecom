import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/api/produits";
import { Status } from "@/lib/constants/status";
import { rateLimitResponse } from "@/lib/rate-limit";
import { requireAdminSession } from "@/lib/auth-api";

// Limite: 120 requêtes GET / minute par IP (évite abus / surcharge CPU)
const GET_RATE = { limit: 120, windowMs: 60 * 1000 };

export async function GET(request: NextRequest) {
  const rateLimited = rateLimitResponse(request, GET_RATE);
  if (rateLimited) return rateLimited;

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as Status | null;
    const search = searchParams.get("search") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const featured = searchParams.get("featured") === "true" ? true : undefined;
    const isNewArrival =
      searchParams.get("isNewArrival") === "true" ? true : undefined;
    const isPreOrder =
      searchParams.get("isPreOrder") === "true" ? true : undefined;
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;

    const filters = {
      ...(status && status !== Status.ACTIVE && { status }),
      ...(search && { search }),
      ...(categoryId && { categoryId }),
      ...(featured !== undefined && { featured }),
      ...(isNewArrival !== undefined && { isNewArrival }),
      ...(isPreOrder !== undefined && { isPreOrder }),
      ...(minPrice !== undefined && { minPrice }),
      ...(maxPrice !== undefined && { maxPrice }),
    };

    const products = await productService.getAllProducts(filters);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// Limite: 30 créations / minute par IP
const POST_RATE = { limit: 30, windowMs: 60 * 1000 };

export async function POST(request: NextRequest) {
  const authError = await requireAdminSession(request);
  if (authError) return authError;
  const rateLimited = rateLimitResponse(request, POST_RATE);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const product = await productService.createProduct(body);

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 400 }
    );
  }
}
