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

  // Auto-play functionality (optional)
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      next();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [index, images.length]);

  // Loading state
  if (isLoading && !propImages) {
    return (
      <div className="h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] w-full flex items-center justify-center bg-gray-100">
        <Loader2 className="size-6 sm:size-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Empty state
  if (images.length === 0) {
    return null;
  }

  const currentSlide = images[index];

  return (
    <div className="h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] w-full relative overflow-hidden p-3 sm:p-4 md:p-5">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Images avec animation de fade */}
      {images.map((image, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500  ${i === index ? "opacity-100 z-0" : "opacity-0 z-[-1]"
            }`}
          style={{ backgroundImage: `url(${image.src})` }}
        />
      ))}

      <div className="relative flex flex-col justify-end items-start inset-0 h-full w-full z-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full gap-4 sm:gap-0">
          {/* Content Section */}
          <div className="max-w-full sm:max-w-[60%] lg:max-w-[50%]">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase leading-tight">
              {currentSlide.title}
            </h1>
            {currentSlide.description && (
              <p className="text-white mt-1 sm:mt-2 text-sm sm:text-base md:text-lg line-clamp-2 sm:line-clamp-none">
                {currentSlide.description}
              </p>
            )}

            {/* Buttons - Stacked on mobile, inline on desktop */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4 items-start sm:items-center w-full sm:w-auto">
              {currentSlide.link ? (
                <Link
                  href={currentSlide.link}
                  className="group relative inline-block overflow-hidden px-4 sm:px-6 md:px-7 py-2 bg-white text-xs sm:text-sm font-bold orbitron uppercase cursor-pointer w-full sm:w-auto text-center"
                  style={{ borderRadius: "5px" }}
                >
                  {/* Texte visible */}
                  <span className="block transition-transform duration-250 group-hover:-translate-y-9">
                    {currentSlide.linkText || "Acheter"}
                  </span>

                  {/* Texte qui arrive */}
                  <span className="absolute left-0 top-full w-full text-center transition-transform duration-250 group-hover:-translate-y-7">
                    {currentSlide.linkText || "Acheter"}
                  </span>
                </Link>
              ) : (
                <span
                  className="group relative inline-block overflow-hidden px-4 sm:px-6 md:px-7 py-2 bg-white text-xs sm:text-sm font-bold orbitron uppercase w-full sm:w-auto text-center"
                  style={{ borderRadius: "5px" }}
                >
                  {/* Texte visible */}
                  <span className="block transition-transform duration-250 group-hover:-translate-y-9">
                    Acheter
                  </span>

                  {/* Texte qui arrive */}
                  <span className="absolute left-0 top-full w-full text-center transition-transform duration-250 group-hover:-translate-y-7">
                    Acheter
                  </span>
                </span>
              )}

              <span
                className="hidden sm:inline-block group relative overflow-hidden px-4 sm:px-6 md:px-7 py-2 bg-black/30 text-xs sm:text-sm font-bold orbitron uppercase cursor-pointer hover:border hover:border-white"
                style={{ borderRadius: "5px" }}
              >
                {/* Texte visible */}
                <span className="block text-white transition-transform duration-250 group-hover:-translate-y-9">
                  Voir la collection
                </span>

                {/* Texte qui arrive */}
                <span className="text-white absolute left-0 top-full w-full text-center transition-transform duration-250 group-hover:-translate-y-7">
                  Voir la collection
                </span>
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-2 items-center self-end sm:self-auto">
            {/* Desktop Navigation - Hidden on mobile */}
            <button
              onClick={prev}
              className="hidden sm:block bg-black/50 hover:bg-black/70 text-white p-[.5px] rounded-md z-10 transition-all duration-200 backdrop-blur-sm cursor-pointer"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Dots Navigation */}
            <div className="flex gap-1.5 sm:gap-2 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setIndex(i);
                    }
                  }}
                  className={`h-1 rounded-full transition-all duration-300 ${i === index
                      ? "w-6 sm:w-8 bg-white"
                      : "w-1.5 sm:w-2 bg-white/50 hover:bg-white/75"
                    }`}
                  aria-label={`Aller à l'image ${i + 1}`}
                />
              ))}
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <button
              onClick={next}
              className="hidden sm:block bg-black/50 hover:bg-black/70 text-white p-[.5px] rounded-md z-10 transition-all duration-200 backdrop-blur-sm"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Absolute positioned chevrons */}
        <button
          onClick={prev}
          className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-md z-10 transition-all duration-200 backdrop-blur-sm cursor-pointer"
          aria-label="Image précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={next}
          className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-md z-10 transition-all duration-200 backdrop-blur-sm"
          aria-label="Image suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}