import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/api/produits";
import { Status } from "@/lib/constants/status";

export async function GET(request: NextRequest) {
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

export async function POST(request: NextRequest) {
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
