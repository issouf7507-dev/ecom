"use client";
import { Carousel } from "@/components/ui/Carousel";
import { LandingAccordionItem } from "@/components/ui/interactive-image-accordion";
import { ProductCard } from "@/components/ui/product-card-2";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { Status } from "@prisma/client";
import { Loader2 } from "lucide-react";
import type { Product } from "@/lib/api/produits/types";

export default function HomePage() {
  // Fetch products
  const { data: allProducts = [], isLoading: isLoadingAll } = useProducts({
    status: Status.ACTIVE,
  });

  // Fetch new arrivals
  const { data: newArrivals = [], isLoading: isLoadingNew } = useProducts({
    status: Status.ACTIVE,
    isNewArrival: true,
  });

  // Get product image
  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find((img) => img.isPrimary);
      return (
        primaryImage?.url || product.images[0]?.url || "/images/placeholder.png"
      );
    }
    return "/images/placeholder.png";
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate discount percentage
  const getDiscountPercentage = (
    price: number,
    originalPrice: number | null
  ) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Transform product for ProductCard
  const transformProductForCard = (product: Product) => {
    const discount = getDiscountPercentage(
      product.price,
      product.compareAtPrice
    );
    return {
      imageUrl: getProductImage(product),
      name: product.name,
      tagline:
        product.shortDescription || product.description?.substring(0, 50) || "",
      price: product.price,
      originalPrice: product.compareAtPrice || undefined,
      offerText: discount > 0 ? `${discount}% Off` : "Nouveau",
      currency: "FCFA",
      productId: product.id,
      slug: product.slug,
    };
  };

  // Carousel images are now loaded from the API via the Carousel component

  // const productsData = await (
  //   await fetch("https://dummyjson.com/products")
  // ).json();
  // // console.log(productsData);

  // Animation variants for the container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between each child animation
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="">
      {/* carousel */}
      <Carousel />

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-8">
        {isLoadingAll ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin" />
            <span className="ml-2">Chargement des produits...</span>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {allProducts.slice(0, 5).map((product: Product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity duration-300"
              >
                <div className="relative w-24 h-24 mb-2">
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                    unoptimized={getProductImage(product).includes(
                      "files.edgestore.dev"
                    )}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/placeholder.png";
                    }}
                  />
                </div>
                <h3 className="text-sm text-center font-bold h-12 overflow-hidden line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatPrice(product.price)} FCFA
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="w-full">
          {/* <h2 className="text-2xl font-bold  orbitron">sswdw</h2> */}
          <LandingAccordionItem />
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-2xl font-bold orbitron">Nouveautés</h1>
          {newArrivals.length > 0 && (
            <Link
              href="/collections/new-arrivals"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Voir tout →
            </Link>
          )}
        </div>

        {isLoadingNew ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin" />
            <span className="ml-2">Chargement...</span>
          </div>
        ) : newArrivals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Aucune nouvelle arrivée pour le moment
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {newArrivals.slice(0, 8).map((product: Product) => (
              <motion.div key={product.id} variants={itemVariants as any}>
                <Link href={`/products/${product.slug}`}>
                  <ProductCard {...transformProductForCard(product)} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold orbitron mb-6 sm:mb-8 lg:mb-10">
          SPOTLIGHT
        </h1>

        <div className="w-full">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((item: any) => (
              <div key={item} className="group">
                <div className="relative overflow-hidden" style={{ borderRadius: "5px" }}>
                  <Image
                    src="/images/TIMBERLAND-HOMEPAGE.webp"
                    alt="spotlight"
                    width={1000}
                    height={1000}
                    className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{
                      borderRadius: "5px",
                    }}
                  />
                </div>

                <div className="pt-3 sm:pt-4">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold orbitron mb-2 sm:mb-3">
                    TIMBERLAND
                  </h3>
                  <span
                    className="group/btn relative inline-block overflow-hidden px-4 sm:px-6 lg:px-7 py-2 border border-black text-xs sm:text-sm font-bold orbitron uppercase cursor-pointer hover:bg-black hover:text-white transition-colors duration-300"
                    style={{ borderRadius: "5px" }}
                  >
                    {/* Texte visible */}
                    <span className="block transition-transform duration-250 group-hover/btn:-translate-y-9">
                      <span className="hidden sm:inline">Shop the collection</span>
                      <span className="sm:hidden">Shop now</span>
                    </span>

                    {/* Texte qui arrive */}
                    <span className="absolute left-0 top-full w-full text-center transition-transform duration-250 group-hover/btn:-translate-y-7">
                      <span className="hidden sm:inline">Shop the collection</span>
                      <span className="sm:hidden">Shop now</span>
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 py-8">


        {isLoadingAll ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin" />
            <span className="ml-2">Chargement...</span>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit disponible</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {allProducts
              .filter((p: Product) => p.featured || p.rating > 0)
              .slice(0, 8)
              .map((product: Product) => (
                <motion.div key={product.id} variants={itemVariants as any}>
                  <Link href={`/products/${product.slug}`}>
                    <ProductCard {...transformProductForCard(product)} />
                  </Link>
                </motion.div>
              ))}
          </motion.div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 bg-[#f2efe7]">
        <h1 className="text-2xl font-bold orbitron text-center">
          TESTIMONIALS
        </h1>
        <div className="flex w-full  justify-center items-center">
          <StaggerTestimonials />
        </div>
      </div>
    </div>
  );
}
