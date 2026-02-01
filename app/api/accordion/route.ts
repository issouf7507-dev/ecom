import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get("activeOnly") === "true";

    const where = activeOnly ? { isActive: true } : {};

    const items = await prisma.accordionItem.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching accordion items:", error);
    return NextResponse.json(
      { error: "Failed to fetch accordion items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, image, alt, link, linkText, sortOrder, isActive } = body;

    // Get max sortOrder to set default
    const maxOrder = await prisma.accordionItem.aggregate({
      _max: { sortOrder: true },
    });
    const defaultSortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

    const item = await prisma.accordionItem.create({
      data: {
        title,
        image,
        alt: alt || null,
        link: link || null,
        linkText: linkText || null,
        sortOrder: sortOrder ?? defaultSortOrder,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("Error creating accordion item:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create accordion item" },
      { status: 400 }
    );
  }
}
