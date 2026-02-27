import Link from "next/link";
import { getCatalogueSlugs } from "@/lib/salon-catalogues";
import { getSalonCatalogueBySlugForPublic } from "@/lib/salon-catalogues-server";
import { CatalogueGallery } from "./CatalogueGallery";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCatalogueSlugs().map((slug) => ({ slug }));
}

export default async function SalonCatalogueGalleryPage({ params }: PageProps) {
  const { slug } = await params;
  const catalogue = await getSalonCatalogueBySlugForPublic(slug);

  if (!catalogue) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm orbitron text-gray-600">
          <Link href="/" className="hover:text-black transition-colors">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/salon-de-beaute"
            className="hover:text-black transition-colors"
          >
            Salon de beauté
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black font-semibold">{catalogue.title}</span>
        </nav>
      </div>

      {/* Header galerie */}
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/salon-de-beaute"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black orbitron text-sm font-semibold mb-6"
        >
          ← Retour aux catalogues
        </Link>
        <h1 className="text-4xl font-bold orbitron mb-2">{catalogue.title}</h1>
        <p className="text-gray-600 orbitron max-w-2xl">
          {catalogue.shortDescription}
        </p>
      </div>

      <CatalogueGallery catalogue={catalogue} />
    </div>
  );
}
