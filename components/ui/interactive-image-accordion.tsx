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
}: {
  item: any;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
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
  const ButtonComponent = item.link ? Link : motion.button;

  return (
    <div
      className={`relative h-[450px]  overflow-hidden transition-all duration-400 rounded-md group  ${
        isActive ? "w-[1000px]" : "w-[500px]"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Image
        src={item.image || "/images/placeholder.png"}
        alt={item.alt || item.title}
        width={1000}
        height={1000}
        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-400"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/images/placeholder.png";
        }}
      />
      <div className="absolute inset-0 w-full h-full bg-black/25"></div>

      {item.link ? (
        <motion.div
          className={`
            px-7 py-2 text-white font-semibold uppercase bg-black/40  rounded-md hover:bg-black/60 cursor-pointer transition-all duration-200 flex items-center gap-2
            ${isFixed ? "absolute left-10 bottom-5" : "absolute top-5 left-10"}
          `}
          style={{
            y: isFixed ? 0 : y,
          }}
        >
          <Link
            href={item.link}
            className="flex items-center gap-2"
          >
            {buttonContent} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <motion.button
          className={`
            px-7 py-2 text-white font-semibold uppercase bg-black/40  rounded-md hover:bg-black/60 cursor-pointer transition-all duration-200 flex items-center gap-2
            ${isFixed ? "absolute left-10 bottom-5" : "absolute top-5 left-10"}
          `}
          style={{
            y: isFixed ? 0 : y,
          }}
        >
          {buttonContent} <ArrowRight className="w-4 h-4" />
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
  const handleItemLeave = () => {
    if (accordionItems.length > 0) {
      setActiveIndex(accordionItems.length - 1);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white font-sans py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-gray-400" />
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
      <section className=" px-4 md:py-10">
        <h2 className="text-4xl mb-5 font-bold">Nos Collections</h2>
        <div className="flex ">
          {/* Right Side: Image Accordion */}
          <div className="w-full">
            {/* Changed flex-col to flex-row to keep the layout consistent */}
            <div className="flex flex-row gap-4 w-full">
              {accordionItems.map((item: any, index: number) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                  onMouseLeave={handleItemLeave}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-amber-50/35 py-5">
        <div className="grid grid-cols-4 container mx-auto px-4">
          <div className="flex  items-center justify-center gap-5">
            <div>
              <h1 className="text-2xl font-bold orbitron">Authentic & Rare</h1>
              <p className="text-sm text-gray-500 orbitron">
                Genuine, exclusive sneakers
              </p>
            </div>
          </div>
          <div className="flex  items-center justify-center gap-5">
            <div>s</div>
            <div>
              <h1 className="text-2xl font-bold orbitron">Luxury Focus</h1>
              <p className="text-sm text-gray-500 orbitron">
                Premium fashion-meets-culture
              </p>
            </div>
          </div>
          <div className="flex  items-center justify-center gap-5">
            <div>s</div>
            <div>
              <h1 className="text-2xl font-bold orbitron">Omnichannel</h1>
              <p className="text-sm text-gray-500 orbitron">
                Online + retail presence
              </p>
            </div>
          </div>
          <div className="flex  items-center justify-center gap-5">
            <div>s</div>
            <div>
              <h1 className="text-2xl font-bold orbitron">Community-First</h1>
              <p className="text-sm text-gray-500 orbitron">
                Content & cultural events
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
