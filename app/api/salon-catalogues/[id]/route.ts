import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const catalogue = await prisma.salonCatalogue.findUnique({
      where: { id },
      include: {
        gallery: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!catalogue) {
      return NextResponse.json(
        { error: "Catalogue introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(catalogue);
  } catch (error) {
    console.error("Error fetching salon catalogue:", error);
    return NextResponse.json(
      { error: "Failed to fetch catalogue" },
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
    const { slug, title, shortDescription, coverImage, sortOrder, gallery } = body;

    const data: Record<string, unknown> = {};
    if (slug !== undefined) data.slug = slug.trim().toLowerCase().replace(/\s+/g, "-");
    if (title !== undefined) data.title = title;
    if (shortDescription !== undefined) data.shortDescription = shortDescription;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;

    if (Array.isArray(gallery)) {
      await prisma.salonCatalogueImage.deleteMany({
        where: { catalogueId: id },
      });
      await prisma.salonCatalogueImage.createMany({
        data: gallery.map((url: string, i: number) => ({
          catalogueId: id,
          url: url || "/images/placeholder.png",
          sortOrder: i,
        })),
      });
    }

    const catalogue = await prisma.salonCatalogue.update({
      where: { id },
      data,
      include: {
        gallery: { orderBy: { sortOrder: "asc" } },
      },
    });

    return NextResponse.json(catalogue);
  } catch (error: any) {
    console.error("Error updating salon catalogue:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update catalogue" },
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
    await prisma.salonCatalogue.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting salon catalogue:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete catalogue" },
      { status: 400 }
    );
  }
}
