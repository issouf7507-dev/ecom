"use client";

import { useState, useEffect, useMemo } from "react";

import { ProductCard } from "@/components/ui/product-card-2";
import Link from "next/link";
import {
  ChevronDown,
  Grid,
  List,
  SlidersHorizontal,
  X,
  Tag,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Status } from "@prisma/client";
import type { Product as ApiProduct } from "@/lib/api/produits/types";

// Interface pour les produits transformés pour l'affichage
interface Product {
  imageUrl: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  offerText: string;
  id: string;
  slug: string;
  isNew: boolean;
  category: string;
}

type SortOption = "newest" | "price-low" | "price-high" | "name" | "popular";

interface FilterState {
  priceRange: string;
  search: string;
}

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

// Transform API product to display product
const transformProduct = (product: ApiProduct): Product => {
  const discount = getDiscountPercentage(product.price, product.compareAtPrice);

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
    category: product.category?.name || "Non catégorisé",
  };
};


const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48] as const;
const DEFAULT_ITEMS_PER_PAGE = 12;


export default function AccessoriesPage() {
  // Fetch all categories to find "accessoires"
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories({
      status: Status.ACTIVE,
    });

  // Find the "accessoires" category
  const accessoriesCategory = useMemo(() => {
    return categories.find(
      (cat) =>
        cat.name.toLowerCase() === "accessoires" ||
        cat.slug.toLowerCase() === "accessoires"
    );
  }, [categories]);

  // Fetch products filtered by accessories category
  const { data: apiProducts = [], isLoading: isLoadingProducts } = useProducts({
    status: Status.ACTIVE,
    categoryId: accessoriesCategory?.id,
  });

  // Transform API products to display products
  const allProducts = useMemo(() => {
    return apiProducts.map(transformProduct);
  }, [apiProducts]);

  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: "all",
    search: "",
  });

  const isLoading = isLoadingCategories || isLoadingProducts;



  // Filter and sort products
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by search
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.tagline.toLowerCase().includes(searchLower)
      );
    }

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

    // Sort products
    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "popular":
          // Sort by isNew first, then by name
          if (a.isNew !== b.isNew) {
            return a.isNew ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          // Sort by isNew first, then by name
          if (a.isNew !== b.isNew) {
            return a.isNew ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
      }
    });

    setProducts(sorted);
  }, [sortBy, filters, allProducts]);

  // Reset to page 1 when filters or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, filters]);


  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return products.slice(start, start + itemsPerPage);
  }, [products, currentPage, itemsPerPage]);

  // Page numbers to show (with ellipsis if many pages)
  const pageNumbers = useMemo((): (number | "ellipsis")[] => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | "ellipsis")[] = [];
    let prevNum: number | undefined;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }
    for (const i of range) {
      if (prevNum !== undefined && i - prevNum !== 1) rangeWithDots.push("ellipsis");
      rangeWithDots.push(i);
      prevNum = i;
    }
    return rangeWithDots;
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: "all",
      search: "",
    });
  };

  const activeFiltersCount =
    (filters.priceRange !== "all" ? 1 : 0) +
    (filters.search.trim() ? 1 : 0);

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
          <span className="text-black font-semibold">Accessoires</span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold orbitron mb-4">
            ACCESSOIRES
          </h1>
          <p className="text-lg text-gray-600 orbitron max-w-2xl mx-auto">
            Découvrez notre sélection complète d'accessoires de qualité
          </p>
        </div>

        {/* Filters and Sort Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b">
          {/* Left: Filter button and results count */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
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
              {products.length} accessoire{products.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Right: Sort and View mode */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Search */}
            <input
              type="text"
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black orbitron text-sm"
            />

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors orbitron text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="newest">Plus récents</option>
                <option value="popular">Populaires</option>
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
        {isFilterOpen && (
          <div className="mb-8 pb-6 border-b">
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
                  {filters.search.trim() && (
                    <span className="px-3 py-1 bg-black text-white rounded-full text-xs orbitron flex items-center gap-2">
                      Recherche: {filters.search}
                      <button
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, search: "" }))
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
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin" />
            <span className="ml-2 orbitron">Chargement des accessoires...</span>
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
              {products.map((product) => (
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
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                    aria-label="Page précédente"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <div className="flex items-center gap-1">
                    {pageNumbers.map((page, idx) =>
                      page === "ellipsis" ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-2 text-gray-400"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`min-w-9 py-2 px-2 rounded-lg border transition-colors orbitron text-sm font-semibold ${currentPage === page
                            ? "bg-black text-white border-black"
                            : "border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                    aria-label="Page suivante"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-600 orbitron">
                  Page {currentPage} sur {totalPages}
                </span>
              </div>

            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 orbitron mb-4">
              Aucun accessoire trouvé
            </p>
            {!accessoriesCategory && (
              <p className="text-sm text-gray-500 orbitron mb-4">
                La catégorie "Accessoires" n'existe pas encore dans la base de données.
              </p>
            )}
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
