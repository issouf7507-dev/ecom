import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slide = await prisma.carouselSlide.findUnique({
      where: { id },
    });

    if (!slide) {
      return NextResponse.json(
        { error: "Carousel slide not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(slide);
  } catch (error) {
    console.error("Error fetching carousel slide:", error);
    return NextResponse.json(
      { error: "Failed to fetch carousel slide" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, image, alt, link, linkText, sortOrder, isActive } = body;

    const slide = await prisma.carouselSlide.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(alt !== undefined && { alt }),
        ...(link !== undefined && { link }),
        ...(linkText !== undefined && { linkText }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(slide);
  } catch (error: any) {
    console.error("Error updating carousel slide:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update carousel slide" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.carouselSlide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting carousel slide:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete carousel slide" },
      { status: 400 }
    );
  }
}
