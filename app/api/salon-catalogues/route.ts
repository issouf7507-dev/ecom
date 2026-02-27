import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-api";

export async function GET() {
  try {
    const catalogues = await prisma.salonCatalogue.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        gallery: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });
    return NextResponse.json(catalogues);
  } catch (error) {
    console.error("Error fetching salon catalogues:", error);
    return NextResponse.json(
      { error: "Failed to fetch catalogues" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminSession(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { slug, title, shortDescription, coverImage, sortOrder, gallery = [] } = body;

    if (!slug?.trim() || !title?.trim()) {
      return NextResponse.json(
        { error: "slug et title sont requis" },
        { status: 400 }
      );
    }

    const maxOrder = await prisma.salonCatalogue.aggregate({
      _max: { sortOrder: true },
    });
    const defaultSortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

    const catalogue = await prisma.salonCatalogue.create({
      data: {
        slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
        title,
        shortDescription: shortDescription ?? "",
        coverImage: coverImage ?? "/images/placeholder.png",
        sortOrder: sortOrder ?? defaultSortOrder,
        gallery: {
          create: (Array.isArray(gallery) ? gallery : []).map((url: string, i: number) => ({
            url: url || "/images/placeholder.png",
            sortOrder: i,
          })),
        },
      },
      include: {
        gallery: { orderBy: { sortOrder: "asc" } },
      },
    });

    return NextResponse.json(catalogue, { status: 201 });
  } catch (error: any) {
    console.error("Error creating salon catalogue:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create catalogue" },
      { status: 400 }
    );
  }
}
