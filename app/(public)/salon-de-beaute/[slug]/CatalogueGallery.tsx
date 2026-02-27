"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import type { CatalogueItem } from "@/lib/salon-catalogues";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export function CatalogueGallery({ catalogue }: { catalogue: CatalogueItem }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  }, [lightboxIndex]);

  const goNext = useCallback(() => {
    if (
      lightboxIndex !== null &&
      lightboxIndex < catalogue.gallery.length - 1
    ) {
      setLightboxIndex(lightboxIndex + 1);
    }
  }, [lightboxIndex, catalogue.gallery.length]);

  return (
    <>
      {/* Grille portfolio / galerie */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalogue.gallery.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => openLightbox(index)}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              <Image
                src={src}
                alt={`${catalogue.title} - élément ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && closeLightbox()}
      >
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-black/95 border-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {catalogue.title} - galerie
          </DialogTitle>
          {lightboxIndex !== null && catalogue.gallery[lightboxIndex] && (
            <div className="relative w-full aspect-4/3 bg-black">
              <Image
                src={catalogue.gallery[lightboxIndex]}
                alt={`${catalogue.title} - vue ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="95vw"
              />
              <div className="absolute inset-y-0 left-0 w-16 flex items-center justify-center">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={lightboxIndex === 0}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="size-8" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 w-16 flex items-center justify-center">
                <button
                  type="button"
                  onClick={goNext}
                  disabled={lightboxIndex === catalogue.gallery.length - 1}
                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-30 disabled:pointer-events-none transition-colors rotate-180"
                  aria-label="Image suivante"
                >
                  <ChevronLeft className="size-8" />
                </button>
              </div>
              <div className="absolute top-4 right-4">
                <span className="text-white/80 orbitron text-sm">
                  {lightboxIndex + 1} / {catalogue.gallery.length}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
