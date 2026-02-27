"use server";

import { prisma } from "@/lib/prisma";
import {
  SALON_CATALOGUES,
  getCatalogueBySlug as getStaticBySlug,
  mapToCatalogueItem,
  type CatalogueItem,
} from "@/lib/salon-catalogues";

/** Récupère les catalogues pour le site public (DB en priorité, sinon données statiques). */
export async function getSalonCataloguesForPublic(): Promise<CatalogueItem[]> {
  try {
    const rows = await prisma.salonCatalogue.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        gallery: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (rows.length > 0) {
      return rows.map(mapToCatalogueItem);
    }
  } catch {
    // Table absente ou erreur → fallback statique
  }
  return SALON_CATALOGUES;
}

/** Récupère un catalogue par slug pour le site public (DB en priorité, sinon statique). */
export async function getSalonCatalogueBySlugForPublic(
  slug: string
): Promise<CatalogueItem | null> {
  try {
    const row = await prisma.salonCatalogue.findUnique({
      where: { slug },
      include: {
        gallery: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (row) return mapToCatalogueItem(row);
  } catch {
    // ignore
  }
  return getStaticBySlug(slug) ?? null;
}
