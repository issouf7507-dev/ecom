"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductCard } from "@/components/ui/product-card-2";
import type { Product as ApiProduct } from "@/lib/api/produits/types";
import type { Product } from "@/types";
import { Loader2, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Status } from "@/lib/constants/status";

// Convertir ApiProduct en Product pour AddToCartButton
const convertToCartProduct = (apiProduct: ApiProduct): Product => {
  const primaryImage =
    apiProduct.images?.find((img) => img.isPrimary)?.url ||
    apiProduct.images?.[0]?.url ||
    "/images/placeholder.png";

  const allImages = apiProduct.images?.map((img) => img.url) || [primaryImage];

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description || apiProduct.shortDescription || "",
    price: apiProduct.price,
    image: primaryImage,
    images: allImages,
    category: apiProduct.category?.name || "Non catégorisé",
    stock: apiProduct.stockQuantity,
    sku: apiProduct.barcode || undefined,
    rating: apiProduct.rating,
  };
};

// Formatage du prix
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Calculer le pourcentage de réduction
const getDiscountPercentage = (price: number, originalPrice: number | null) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

// Transformer un produit API pour ProductCard
const transformProductForCard = (apiProduct: ApiProduct) => {
  const primaryImage =
    apiProduct.images?.find((img) => img.isPrimary)?.url ||
    apiProduct.images?.[0]?.url ||
    "/images/placeholder.png";

  const discount = getDiscountPercentage(
    apiProduct.price,
    apiProduct.compareAtPrice
  );

  return {
    imageUrl: primaryImage,
    name: apiProduct.name,
    tagline:
      apiProduct.shortDescription ||
      apiProduct.description?.substring(0, 50) ||
      "",
    price: apiProduct.price,
    originalPrice: apiProduct.compareAtPrice || undefined,
    offerText: discount > 0 ? `${discount}% Off` : "Nouveau",
    id: apiProduct.id,
    slug: apiProduct.slug,
    isNew: apiProduct.isNewArrival,
    category: apiProduct.category?.name || "Non catégorisé",
  };
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.id as string;

  const { data: product, isLoading, error } = useProduct(slug);

  // Fetch related products (same category or other active products)
  const { data: allProducts = [] } = useProducts({
    status: Status.ACTIVE,
    ...(product?.categoryId && { categoryId: product.categoryId }),
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Convertir le produit pour le panier
  const cartProduct = useMemo(() => {
    if (!product) return null;
    return convertToCartProduct(product);
  }, [product]);

  // Obtenir toutes les images
  const productImages = useMemo(() => {
    if (!product?.images || product.images.length === 0) {
      return ["/images/placeholder.png"];
    }
    return product.images
      .sort((a, b) => {
        if (a.isPrimary) return -1;
        if (b.isPrimary) return 1;
        return a.sortOrder - b.sortOrder;
      })
      .map((img) => img.url);
  }, [product]);

  // Obtenir les produits similaires (exclure le produit actuel)
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const filtered = allProducts.filter((p) => p.id !== product.id);
    // Limiter à 4 produits
    return filtered.slice(0, 4).map(transformProductForCard);
  }, [allProducts, product]);

  // Navigation des images
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin" />
          <p className="orbitron text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl orbitron text-gray-600 mb-4">
            Produit non trouvé
          </p>
          <Link
            href="/products"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors orbitron font-semibold inline-block"
          >
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const discount = getDiscountPercentage(product.price, product.compareAtPrice);
  const isInStock = product.stockQuantity > 0;
  const isNewArrival = product.isNewArrival;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm orbitron text-gray-600">
          <Link href="/" className="hover:text-black transition-colors">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-black transition-colors">
            Produits
          </Link>
          <span className="mx-2">/</span>
          {product.category && (
            <>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-black transition-colors"
              >
                {product.category.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-black font-semibold">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Images Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden group">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300"
              />

              {/* Navigation buttons for multiple images */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}

              {/* Discount badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold orbitron">
                  -{discount}%
                </div>
              )}

              {/* New Arrival badge */}
              {isNewArrival && (
                <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-bold orbitron">
                  Nouveau
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-3 gap-2 overflow-x-auto pb-2 ">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-black"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category */}
            {product.category && (
              <div>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-sm orbitron text-gray-600 hover:text-black transition-colors"
                >
                  {product.category.name}
                </Link>
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-4xl lg:text-5xl font-bold orbitron">
              {product.name}
            </h1>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-lg text-gray-600 orbitron">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold orbitron">
                {formatPrice(product.price)} FCFA
              </span>
              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through orbitron">
                      {formatPrice(product.compareAtPrice)} FCFA
                    </span>
                    {discount > 0 && (
                      <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded orbitron font-semibold">
                        Économisez{" "}
                        {formatPrice(product.compareAtPrice - product.price)}{" "}
                        FCFA
                      </span>
                    )}
                  </>
                )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isInStock ? (
                <>
                  <Check className="size-5 text-green-500" />
                  <span className="text-green-600 orbitron font-semibold">
                    En stock ({product.stockQuantity} disponible
                    {product.stockQuantity > 1 ? "s" : ""})
                  </span>
                </>
              ) : (
                <>
                  <X className="size-5 text-red-500" />
                  <span className="text-red-600 orbitron font-semibold">
                    Rupture de stock
                  </span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            {isInStock && (
              <div className="flex items-center gap-4">
                <label className="orbitron font-semibold">Quantité:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 orbitron font-semibold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                    }
                    className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.stockQuantity}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            {cartProduct && (
              <div className="pt-4">
                <AddToCartButton product={cartProduct} quantity={quantity} />
              </div>
            )}

            {/* Product Details */}
            <div className="pt-6 border-t space-y-4">
              <h2 className="text-xl font-bold orbitron">Détails du produit</h2>

              {product.description && (
                <div>
                  <h3 className="font-semibold orbitron mb-2">Description</h3>
                  <div
                    className="text-gray-700 orbitron prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: product.description.replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {product.barcode && (
                  <div>
                    <span className="text-sm text-gray-600 orbitron">
                      Référence:
                    </span>
                    <p className="orbitron font-semibold">{product.barcode}</p>
                  </div>
                )}
                {product.rating > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 orbitron">
                      Note:
                    </span>
                    <p className="orbitron font-semibold">
                      {product.rating.toFixed(1)} / 5.0
                      {product.reviewCount > 0 &&
                        ` (${product.reviewCount} avis)`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-16 border-t">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold orbitron mb-8 text-center">
              {product.category
                ? `Autres produits de ${product.category.name}`
                : "Autres produits"}
            </h2>
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              {relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct.id}
                  variants={{
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
                  }}
                >
                  <Link
                    href={`/products/${relatedProduct.slug}`}
                    className="block h-full"
                  >
                    <ProductCard
                      {...relatedProduct}
                      currency="FCFA"
                      className="cursor-pointer h-full"
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
