"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ui/product-card-2";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  SlidersHorizontal,
  X,
  Calendar,
  Tag,
  Palette,
  Loader2,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Status } from "@prisma/client";
import type { Product as ApiProduct } from "@/lib/api/produits/types";

// Interface pour les produits transformés pour l'affichage
interface Product {
  imageUrl: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  isCouponPrice?: boolean;
  offerText: string;
  id: string;
  slug: string;
  isNew: boolean;
  color: string;
  category: string;
  releaseDate: string; // Format: "YYYY-MM-DD"
}

type SortOption =
  | "newest"
  | "price-low"
  | "price-high"
  | "name"
  | "date-newest"
  | "date-oldest";

interface FilterState {
  priceRange: string;
  colors: string[];
  categories: string[];
  dateRange: string;
}

// Pagination
const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48] as const;
const DEFAULT_ITEMS_PER_PAGE = 12;

// Couleurs disponibles (sera dynamique basé sur les produits)
const colorMap: Record<string, string> = {
  Noir: "#000000",
  Blanc: "#FFFFFF",
  Bleu: "#3B82F6",
  Rouge: "#EF4444",
  Vert: "#10B981",
  Jaune: "#F59E0B",
  Rose: "#EC4899",
  Gris: "#6B7280",
  Marron: "#92400E",
  Violet: "#8B5CF6",
};

// Helper functions
const getProductImage = (product: ApiProduct) => {
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find((img) => img.isPrimary);
    return (
      primaryImage?.url || product.images[0]?.url || "/images/placeholder.png"
    );
  }
  return "/images/placeholder.png";
};

const getDiscountPercentage = (price: number, originalPrice: number | null) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

// Extract color from variant name or return default
const extractColor = (product: ApiProduct): string => {
  // Try to extract color from variant names or description
  const colorKeywords = Object.keys(colorMap);
  const searchText = `${product.name} ${product.description || ""
    }`.toLowerCase();

  for (const color of colorKeywords) {
    if (searchText.includes(color.toLowerCase())) {
      return color;
    }
  }

  return "Noir"; // Default color
};

// Transform API product to display product
const transformProduct = (product: ApiProduct): Product => {
  const discount = getDiscountPercentage(product.price, product.compareAtPrice);
  const releaseDate = product.releaseDate
    ? new Date(product.releaseDate).toISOString().split("T")[0]
    : new Date(product.createdAt).toISOString().split("T")[0];

  return {
    imageUrl: getProductImage(product),
    name: product.name,
    tagline:
      product.shortDescription || product.description?.substring(0, 50) || "",
    price: product.price,
    originalPrice: product.compareAtPrice || undefined,
    offerText: discount > 0 ? `${discount}% Off` : "Nouveau",
    id: product.id,
    slug: product.slug,
    isNew: product.isNewArrival,
    color: extractColor(product),
    category: product.category?.name || "Non catégorisé",
    releaseDate,
  };
};

export default function NewArrivalsPage() {
  // Fetch new arrivals from API
  const { data: apiProducts = [], isLoading } = useProducts({
    status: Status.ACTIVE,
    isNewArrival: true,
  });

  // Transform API products to display products
  const allProducts = useMemo(() => {
    return apiProducts.map(transformProduct);
  }, [apiProducts]);

  // Extract unique colors and categories from products
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    allProducts.forEach((p) => colors.add(p.color));
    return Array.from(colors).sort();
  }, [allProducts]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    allProducts.forEach((p) => categories.add(p.category));
    return Array.from(categories).sort();
  }, [allProducts]);

  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: "all",
    colors: [],
    categories: [],
    dateRange: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Filter and sort products
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by price range
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      filtered = filtered.filter((p) => {
        if (max) {
          return p.price >= min && p.price <= max;
        }
        return p.price >= min;
      });
    }

    // Filter by colors
    if (filters.colors.length > 0) {
      filtered = filtered.filter((p) => filters.colors.includes(p.color));
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category)
      );
    }

    // Filter by date range
    if (filters.dateRange !== "all") {
      const now = new Date();
      let cutoffDate = new Date();

      switch (filters.dateRange) {
        case "last-week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "last-month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "last-3-months":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "last-6-months":
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case "last-year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter((p) => {
        const productDate = new Date(p.releaseDate);
        return productDate >= cutoffDate;
      });
    }

    // Sort products
    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "date-newest":
          return (
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
          );
        case "date-oldest":
          return (
            new Date(a.releaseDate).getTime() -
            new Date(b.releaseDate).getTime()
          );
        case "newest":
        default:
          // Sort by release date or creation date (newest first)
          return (
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
          );
      }
    });

    setProducts(sorted);
  }, [sortBy, filters, allProducts]);

  // Remettre à la page 1 quand filtres ou tri changent
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  // Pagination : produits de la page courante
  const totalFiltered = products.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "ellipsis", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
    }
    return pages;
  };

  const toggleColor = (color: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const toggleCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: "all",
      colors: [],
      categories: [],
      dateRange: "all",
    });
  };

  const activeFiltersCount =
    (filters.priceRange !== "all" ? 1 : 0) +
    filters.colors.length +
    filters.categories.length +
    (filters.dateRange !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm orbitron text-gray-600">
          <Link href="/" className="hover:text-black transition-colors">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black font-semibold">Nouveautés</span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold orbitron mb-4">NOUVEAUTÉS</h1>
          <p className="text-lg text-gray-600 orbitron max-w-2xl mx-auto">
            Découvrez nos dernières arrivées et soyez parmi les premiers à
            profiter des nouveautés exclusives
          </p>
        </div>

        {/* Filters and Sort Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b">
          {/* Left: Filter button and results count */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors orbitron text-sm font-semibold relative"
            >
              <SlidersHorizontal className="size-4" />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <span className="text-sm text-gray-600 orbitron">
              {totalFiltered} produit{totalFiltered > 1 ? "s" : ""}
              {totalFiltered > 0 && (
                <span className="text-gray-500">
                  {" "}(page {currentPage}/{totalPages})
                </span>
              )}
            </span>
            {totalFiltered > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 orbitron">Afficher :</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black orbitron text-sm cursor-pointer"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Right: Sort and View mode */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors orbitron text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="newest">Plus récents</option>
                <option value="date-newest">Date (plus récent)</option>
                <option value="date-oldest">Date (plus ancien)</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
                <option value="name">Nom A-Z</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-4 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${viewMode === "grid"
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
                  }`}
                aria-label="Vue grille"
              >
                <Grid className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${viewMode === "list"
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
                  }`}
                aria-label="Vue liste"
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <div
              className="mb-8 pb-6 border-b overflow-hidden"
            >
              <div className="space-y-6">
                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold orbitron">
                      Filtres actifs:
                    </span>
                    {filters.priceRange !== "all" && (
                      <span className="px-3 py-1 bg-black text-white rounded-full text-xs orbitron flex items-center gap-2">
                        Prix: {filters.priceRange}
                        <button
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: "all",
                            }))
                          }
                          className="hover:bg-white/20 rounded-full p-0.5"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    )}
                    {filters.colors.map((color) => (
                      <span
                        key={color}
                        className="px-3 py-1 bg-black text-white rounded-full text-xs orbitron flex items-center gap-2"
                      >
                        {color}
                        <button
                          onClick={() => toggleColor(color)}
                          className="hover:bg-white/20 rounded-full p-0.5"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                    {filters.categories.map((cat) => (
                      <span
                        key={cat}
                        className="px-3 py-1 bg-black text-white rounded-full text-xs orbitron flex items-center gap-2"
                      >
                        {cat}
                        <button
                          onClick={() => toggleCategory(cat)}
                          className="hover:bg-white/20 rounded-full p-0.5"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                    {filters.dateRange !== "all" && (
                      <span className="px-3 py-1 bg-black text-white rounded-full text-xs orbitron flex items-center gap-2">
                        {filters.dateRange === "last-week"
                          ? "Dernière semaine"
                          : filters.dateRange === "last-month"
                            ? "Dernier mois"
                            : filters.dateRange === "last-3-months"
                              ? "3 derniers mois"
                              : filters.dateRange === "last-6-months"
                                ? "6 derniers mois"
                                : "Dernière année"}
                        <button
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: "all",
                            }))
                          }
                          className="hover:bg-white/20 rounded-full p-0.5"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    )}
                    <button
                      onClick={resetFilters}
                      className="px-3 py-1 border border-gray-300 rounded-full text-xs orbitron hover:bg-gray-50 transition-colors"
                    >
                      Tout effacer
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Prix */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Tag className="size-4" />
                      <h3 className="font-bold orbitron text-base">Prix</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Tous", value: "all" },
                        { label: "Moins de 50 000", value: "0-50000" },
                        { label: "50 000 - 100 000", value: "50000-100000" },
                        { label: "100 000 - 200 000", value: "100000-200000" },
                        { label: "200 000 - 500 000", value: "200000-500000" },
                        { label: "Plus de 500 000", value: "500000-" },
                      ].map((range) => (
                        <button
                          key={range.value}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: range.value,
                            }))
                          }
                          className={`px-3 py-1.5 rounded-lg border transition-colors orbitron text-xs font-semibold ${filters.priceRange === range.value
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Couleur */}


                  {/* Catégorie */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Tag className="size-4" />
                      <h3 className="font-bold orbitron text-base">
                        Catégorie
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      {availableCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`px-3 py-2 rounded-lg border transition-colors orbitron text-xs font-semibold text-left ${filters.categories.includes(category)
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <h3 className="font-bold orbitron text-base">Date</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: "Toutes les dates", value: "all" },
                        { label: "Dernière semaine", value: "last-week" },
                        { label: "Dernier mois", value: "last-month" },
                        {
                          label: "3 derniers mois",
                          value: "last-3-months",
                        },
                        {
                          label: "6 derniers mois",
                          value: "last-6-months",
                        },
                        { label: "Dernière année", value: "last-year" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: option.value,
                            }))
                          }
                          className={`px-3 py-2 rounded-lg border transition-colors orbitron text-xs font-semibold text-left ${filters.dateRange === option.value
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin" />
            <span className="ml-2 orbitron">Chargement des produits...</span>
          </div>
        ) : products.length > 0 ? (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "space-y-4"
              }

            >
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}

                  className={viewMode === "list" ? "flex gap-4" : ""}
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="block h-full"
                  >
                    <ProductCard
                      {...product}
                      currency="FCFA"
                      className="cursor-pointer"
                    />
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 border-2 border-gray-200 rounded-lg orbitron font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 hover:border-gray-300 transition-colors"
                  aria-label="Page précédente"
                >
                  <ChevronLeft className="size-5" />
                  Précédent
                </button>
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, i) =>
                    page === "ellipsis" ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-10 py-2 px-2 rounded-lg orbitron font-semibold transition-colors ${currentPage === page
                          ? "bg-black text-white"
                          : "border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                          }`}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 border-2 border-gray-200 rounded-lg orbitron font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 hover:border-gray-300 transition-colors"
                  aria-label="Page suivante"
                >
                  Suivant
                  <ChevronRight className="size-5" />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 orbitron mb-4">
              Aucun produit trouvé
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors orbitron font-semibold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
