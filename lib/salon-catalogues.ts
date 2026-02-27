/**
 * Catalogues Salon de beauté : styles de décoration avec galerie d'images.
 * Remplacer les URLs par vos vraies images (public ou hébergées).
 */
export interface CatalogueItem {
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  /** Images de la galerie / portfolio pour ce style */
  gallery: string[];
}

export const SALON_CATALOGUES: CatalogueItem[] = [
  {
    slug: "vintage",
    title: "Décoration vintage",
    shortDescription:
      "Ambiance rétro et chaleureuse : miroirs anciens, mobilier d'époque et accessoires soigneusement sélectionnés pour un salon à l'identité unique.",
    coverImage: "/images/placeholder.png",
    gallery: [
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
    ],
  },
  {
    slug: "moderne",
    title: "Décoration moderne",
    shortDescription:
      "Lignes épurées, matériaux contemporains et éclairage soigné pour un salon au look actuel et professionnel.",
    coverImage: "/images/placeholder.png",
    gallery: [
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
    ],
  },
  {
    slug: "contemporain",
    title: "Décoration contemporain",
    shortDescription:
      "Un mix équilibré entre classique et tendance : confort et esthétique pour un salon accueillant au quotidien.",
    coverImage: "/images/placeholder.png",
    gallery: [
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
    ],
  },
  {
    slug: "minimaliste",
    title: "Décoration minimaliste",
    shortDescription:
      "Moins c'est plus : espaces dégagés, couleurs neutres et mobilier essentiel pour une atmosphère zen et professionnelle.",
    coverImage: "/images/placeholder.png",
    gallery: [
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
      "/images/placeholder.png",
    ],
  },
];

export function getCatalogueBySlug(slug: string): CatalogueItem | undefined {
  return SALON_CATALOGUES.find((c) => c.slug === slug);
}

export function getCatalogueSlugs(): string[] {
  return SALON_CATALOGUES.map((c) => c.slug);
}

/** Map API/DB catalogue to public CatalogueItem shape */
export function mapToCatalogueItem(c: {
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  gallery: { url: string }[] | { url: string; sortOrder: number }[];
}): CatalogueItem {
  return {
    slug: c.slug,
    title: c.title,
    shortDescription: c.shortDescription,
    coverImage: c.coverImage,
    gallery: c.gallery.map((g) => g.url),
  };
}
