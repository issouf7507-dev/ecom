"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAccordionItems } from "@/hooks/useAccordion";
import Link from "next/link";

// --- Accordion Item Component ---

const AccordionItem = ({
  item,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  item: any;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}) => {
  const { scrollYProgress } = useScroll();

  // Position Y
  const y = useTransform(scrollYProgress, [0, 0.3], [0, 350]);

  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v >= 0.38) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    });
  }, [scrollYProgress]);

  const buttonContent = item.linkText || "Acheter maintenant";

  return (
    <div
      className={`
        relative overflow-hidden transition-all duration-400 rounded-md group cursor-pointer
        ${isActive
          ? "w-full md:w-[600px] lg:w-[1000px] h-[300px] sm:h-[350px] md:h-[450px]"
          : "w-0 md:w-[200px] lg:w-[500px] h-[300px] sm:h-[350px] md:h-[450px] md:block hidden"
        }
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <Image
        src={item.image || "/images/placeholder.png"}
        alt={item.alt || item.title}
        width={1000}
        height={1000}
        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-400"
        unoptimized={item.image?.includes("files.edgestore.dev")}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/images/placeholder.png";
        }}
      />
      <div className="absolute inset-0 w-full h-full bg-black/25"></div>

      {item.link ? (
        <motion.div
          className={`
            px-4 sm:px-7 py-2 text-xs sm:text-sm text-white font-semibold uppercase bg-black/40 rounded-md hover:bg-black/60 cursor-pointer transition-all duration-200 flex items-center gap-2
            ${isFixed ? "absolute left-5 sm:left-10 bottom-5" : "absolute top-5 left-5 sm:left-10"}
          `}
          style={{
            y: isFixed ? 0 : y,
          }}
        >
          <Link href={item.link} className="flex items-center gap-2">
            <span className="hidden sm:inline">{buttonContent}</span>
            <span className="sm:hidden">Acheter</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </motion.div>
      ) : (
        <motion.button
          className={`
            px-4 sm:px-7 py-2 text-xs sm:text-sm text-white font-semibold uppercase bg-black/40 rounded-md hover:bg-black/60 cursor-pointer transition-all duration-200 flex items-center gap-2
            ${isFixed ? "absolute left-5 sm:left-10 bottom-5" : "absolute top-5 left-5 sm:left-10"}
          `}
          style={{
            y: isFixed ? 0 : y,
          }}
        >
          <span className="hidden sm:inline">{buttonContent}</span>
          <span className="sm:hidden">Acheter</span>
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </motion.button>
      )}
    </div>
  );
};

// --- Main App Component ---
export function LandingAccordionItem() {
  // Fetch accordion items from API
  const { data: accordionItems = [], isLoading } = useAccordionItems(true); // activeOnly = true

  const [activeIndex, setActiveIndex] = useState(
    accordionItems.length > 0 ? accordionItems.length - 1 : 0
  );

  // Update activeIndex when items load
  useEffect(() => {
    if (accordionItems.length > 0) {
      setActiveIndex(accordionItems.length - 1);
    }
  }, [accordionItems.length]);

  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleItemLeave = () => {
    if (accordionItems.length > 0) {
      setActiveIndex(accordionItems.length - 1);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white font-sans py-8 sm:py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="size-6 sm:size-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  // Empty state
  if (accordionItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white font-sans">
      <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-5 font-bold">
          Nos Collections
        </h2>
        <div className="flex">
          {/* Right Side: Image Accordion */}
          <div className="w-full">
            {/* Mobile: Show one item at a time with navigation dots */}
            <div className="md:hidden">
              <div className="relative">
                {accordionItems.map((item: any, index: number) => (
                  <div
                    key={item.id}
                    className={`${index === activeIndex ? "block" : "hidden"}`}
                  >
                    <AccordionItem
                      item={item}
                      isActive={true}
                      onMouseEnter={() => { }}
                      onMouseLeave={() => { }}
                      onClick={() => { }}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation dots for mobile */}
              <div className="flex justify-center gap-2 mt-4">
                {accordionItems.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`
                      w-2 h-2 rounded-full transition-all duration-300
                      ${index === activeIndex
                        ? "bg-black w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                      }
                    `}
                    aria-label={`Aller à l'élément ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop: Accordion layout */}
            <div className="hidden md:flex flex-row gap-2 lg:gap-4 w-full">
              {accordionItems.map((item: any, index: number) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                  onMouseLeave={handleItemLeave}
                  onClick={() => handleItemClick(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <div className="bg-amber-50/35 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Feature 1 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-3 sm:gap-5 text-center sm:text-left">
            <div className="w-12 h-12 sm:w-10 sm:h-10 bg-black/5 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg sm:text-base">✓</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold orbitron">
                Authentic & Rare
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 orbitron mt-1">
                Genuine, exclusive sneakers
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-3 sm:gap-5 text-center sm:text-left">
            <div className="w-12 h-12 sm:w-10 sm:h-10 bg-black/5 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg sm:text-base">★</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold orbitron">
                Luxury Focus
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 orbitron mt-1">
                Premium fashion-meets-culture
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-3 sm:gap-5 text-center sm:text-left">
            <div className="w-12 h-12 sm:w-10 sm:h-10 bg-black/5 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg sm:text-base">⚡</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold orbitron">
                Omnichannel
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 orbitron mt-1">
                Online + retail presence
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-3 sm:gap-5 text-center sm:text-left">
            <div className="w-12 h-12 sm:w-10 sm:h-10 bg-black/5 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg sm:text-base">♥</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold orbitron">
                Community-First
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 orbitron mt-1">
                Content & cultural events
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}