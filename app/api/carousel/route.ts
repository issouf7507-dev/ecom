import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get("activeOnly") === "true";

    const where = activeOnly ? { isActive: true } : {};

    const slides = await prisma.carouselSlide.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error("Error fetching carousel slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch carousel slides" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image, alt, link, linkText, sortOrder, isActive } = body;

    // Get max sortOrder to set default
    const maxOrder = await prisma.carouselSlide.aggregate({
      _max: { sortOrder: true },
    });
    const defaultSortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

    const slide = await prisma.carouselSlide.create({
      data: {
        title,
        description: description || null,
        image,
        alt: alt || null,
        link: link || null,
        linkText: linkText || null,
        sortOrder: sortOrder ?? defaultSortOrder,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(slide, { status: 201 });
  } catch (error: any) {
    console.error("Error creating carousel slide:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create carousel slide" },
      { status: 400 }
    );
  }
}
