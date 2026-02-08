import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/api/produits";
import { rateLimitResponse } from "@/lib/rate-limit";
import { requireAdminSession } from "@/lib/auth-api";

const GET_RATE = { limit: 180, windowMs: 60 * 1000 };
const MUTATE_RATE = { limit: 60, windowMs: 60 * 1000 };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimited = rateLimitResponse(request, GET_RATE);
  if (rateLimited) return rateLimited;

  try {
    const { id } = await params;
    
    // Try to find by ID first, then by slug
    let product = await productService.getProductById(id);
    
    // If not found by ID, try by slug
    if (!product) {
      product = await productService.getProductBySlug(id);
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession(request);
  if (authError) return authError;
  const rateLimited = rateLimitResponse(request, MUTATE_RATE);
  if (rateLimited) return rateLimited;

  try {
    const { id } = await params;
    const body = await request.json();
    const product = await productService.updateProduct(id, body);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdminSession(request);
  if (authError) return authError;
  const rateLimited = rateLimitResponse(request, MUTATE_RATE);
  if (rateLimited) return rateLimited;

  try {
    const { id } = await params;
    await productService.deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 400 }
    );
  }
}
