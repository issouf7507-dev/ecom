import Link from "next/link";
import Image from "next/image";
import { getSalonCataloguesForPublic } from "@/lib/salon-catalogues-server";
import { ChevronRight } from "lucide-react";

export default async function SalonDeBeautePage() {
  const catalogues = await getSalonCataloguesForPublic();

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm orbitron text-gray-600">
          <Link href="/" className="hover:text-black transition-colors">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black font-semibold">Salon de beauté</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold orbitron mb-4">
            SALON DE BEAUTÉ
          </h1>
          <p className="text-lg text-gray-600 orbitron max-w-2xl mx-auto">
            Découvrez nos catalogues de décoration par style : vintage, moderne,
            contemporain ou minimaliste. Cliquez sur un style pour voir la
            galerie d&apos;ambiances et d&apos;éléments.
          </p>
        </div>

        {/* Grille de catalogues (cartes style) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {catalogues.map((catalogue) => (
            <Link
              key={catalogue.slug}
              href={`/salon-de-beaute/${catalogue.slug}`}
              className="group block border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-4/3 bg-gray-100">
                <Image
                  src={catalogue.coverImage}
                  alt={catalogue.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg orbitron text-sm font-semibold">
                    Voir la galerie
                    <ChevronRight className="size-4" />
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h2 className="text-xl font-bold orbitron text-white">
                    {catalogue.title}
                  </h2>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 orbitron leading-relaxed">
                  {catalogue.shortDescription}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
