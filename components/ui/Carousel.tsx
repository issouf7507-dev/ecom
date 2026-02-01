"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCarouselSlides } from "@/hooks/useCarousel";

interface CarouselImage {
  src: string;
  alt: string;
  title: string;
  description: string;
  link?: string | null;
  linkText?: string | null;
}

interface CarouselProps {
  images?: CarouselImage[]; // Optional for backward compatibility
}

export function Carousel({ images: propImages }: CarouselProps) {
  // Fetch slides from API
  const { data: apiSlides = [], isLoading } = useCarouselSlides(true); // activeOnly = true

  // Transform API slides to CarouselImage format
  const images: CarouselImage[] = propImages
    ? propImages
    : apiSlides.map((slide: any) => ({
        src: slide.image,
        alt: slide.alt || slide.title,
        title: slide.title,
        description: slide.description || "",
        link: slide.link,
        linkText: slide.linkText,
      }));

  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const prev = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const next = () => {
    if (isTransitioning || images.length === 0) return;
    setIsTransitioning(true);
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Loading state
  if (isLoading && !propImages) {
    return (
      <div className="h-[450px] w-full flex items-center justify-center bg-gray-100">
        <Loader2 className="size-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Empty state
  if (images.length === 0) {
    return null;
  }

  const currentSlide = images[index];

  return (
    <div className="h-[450px] w-full relative overflow-hidden p-5">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      {/* Images avec animation de fade */}
      {images.map((image, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500  ${
            i === index ? "opacity-100 z-0" : "opacity-0 z-[-1]"
          }`}
          style={{ backgroundImage: `url(${image.src})` }}
        />
      ))}

      <div className="relative flex flex-col justify-end items-start inset-0 h-full w-full z-20">
        <div className="flex items-end justify-between w-full">
          <div>
            <h1 className="text-4xl font-bold text-white uppercase ">
              {currentSlide.title}
            </h1>
            {currentSlide.description && (
              <p className="text-white mt-2 text-lg">{currentSlide.description}</p>
            )}

            <div className="flex gap-2 mt-4 items-center">
              {currentSlide.link ? (
                <Link
                  href={currentSlide.link}
                  className="group relative inline-block overflow-hidden px-7 py-2 bg-white text-sm font-bold orbitron uppercase cursor-pointer"
                  style={{ borderRadius: "5px" }}
                >
                  {/* Texte visible */}
                  <span className="block transition-transform duration-250 group-hover:-translate-y-9">
                    {currentSlide.linkText || "Acheter maintenant"}
                  </span>

                  {/* Texte qui arrive */}
                  <span className="absolute left-0 top-full w-full text-center transition-transform duration-250 group-hover:-translate-y-7">
                    Shop the collection
                  </span>
                </Link>
              ) : (
                <span
                  className="group relative inline-block overflow-hidden px-7 py-2 bg-white text-sm font-bold orbitron uppercase"
                  style={{ borderRadius: "5px" }}
                >
                  {/* Texte visible */}
                  <span className="block transition-transform duration-250 group-hover:-translate-y-9">
                    Acheter maintenant
                  </span>

                  {/* Texte qui arrive */}
                  <span className="absolute left-0 top-full w-full text-center transition-transform duration-250 group-hover:-translate-y-7">
                    Shop the collection
                  </span>
                </span>
              )}

              <span
                className="group relative inline-block overflow-hidden px-7 py-2 bg-black/30 text-sm font-bold orbitron uppercase cursor-pointer hover:border hover:border-white"
                style={{ borderRadius: "5px" }}
              >
                {/* Texte visible */}
                <span className="block text-white transition-transform duration-250 group-hover:-translate-y-9">
                  Shop the collection
                </span>

                {/* Texte qui arrive */}
                <span className="text-white absolute left-0 top-full w-full text-center transition-transform duration-250 group-hover:-translate-y-7 ">
                  Shop the collection
                </span>
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={prev}
              className=" bg-black/50 hover:bg-black/70 text-white p-[.5px] rounded-md z-10 transition-all duration-200 backdrop-blur-sm cursor-pointer"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className=" flex gap-2 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setIndex(i);
                    }
                  }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Aller à l'image ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className=" bg-black/50 hover:bg-black/70 text-white p-[.5px] rounded-md z-10 transition-all duration-200 backdrop-blur-sm"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
