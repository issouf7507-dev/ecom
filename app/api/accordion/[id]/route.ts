import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.accordionItem.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Accordion item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching accordion item:", error);
    return NextResponse.json(
      { error: "Failed to fetch accordion item" },
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
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, image, alt, link, linkText, sortOrder, isActive } = body;

    const item = await prisma.accordionItem.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(image !== undefined && { image }),
        ...(alt !== undefined && { alt }),
        ...(link !== undefined && { link }),
        ...(linkText !== undefined && { linkText }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    console.error("Error updating accordion item:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update accordion item" },
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
  try {
    const { id } = await params;
    await prisma.accordionItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting accordion item:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete accordion item" },
      { status: 400 }
    );
  }
}
