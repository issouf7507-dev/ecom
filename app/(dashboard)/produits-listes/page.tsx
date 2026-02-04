"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,

  Funnel,
  ArrowUpDown,
  Star,
  Ellipsis,

  Columns2,
  X,
  Loader2,
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useProducts,
  useDeleteProduct,
  useCreateProduct,
} from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Status } from "@prisma/client";
import { toast } from "sonner";
import type { ProductFilters } from "@/lib/api/produits/types";

// Format price in FCFA
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Get product image
const getProductImage = (product: any) => {
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find((img: any) => img.isPrimary);
    return (
      primaryImage?.url || product.images[0]?.url || "/images/placeholder.png"
    );
  }
  return "/images/placeholder.png";
};

// Check if image is from EdgeStore (needs unoptimized)
const isEdgeStoreImage = (url: string) => {
  return url.includes("files.edgestore.dev");
};

// Get product SKU
const getProductSKU = (product: any) => {
  return product.barcode || "N/A";
};

const getStatusBadge = (status: Status) => {
  const statusMap: Record<Status, { className: string; label: string }> = {
    [Status.ACTIVE]: {
      className:
        "border-green-400 bg-green-50 text-green-800 dark:bg-green-900/70 dark:text-white/80",
      label: "Actif",
    },
    [Status.DRAFT]: {
      className:
        "border-gray-400 bg-gray-50 text-gray-800 dark:bg-gray-900/70 dark:text-white/80",
      label: "Brouillon",
    },
    [Status.INACTIVE]: {
      className:
        "border-orange-400 bg-orange-50 text-orange-800 dark:bg-orange-900/70 dark:text-white/80",
      label: "Inactif",
    },
    [Status.ARCHIVED]: {
      className:
        "border-red-400 bg-red-50 text-red-800 dark:bg-red-900/70 dark:text-white/80",
      label: "Archivé",
    },
  };

  const statusConfig = statusMap[status] || statusMap[Status.ACTIVE];
  return (
    <Badge className={`capitalize ${statusConfig.className}`}>
      {statusConfig.label}
    </Badge>
  );
};

export default function ProductsListPage() {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceRangeFilter, setPriceRangeFilter] = useState<string>("all");
  const [newArrivalFilter, setNewArrivalFilter] = useState<boolean | "all">(
    "all"
  );
  const [preOrderFilter, setPreOrderFilter] = useState<boolean | "all">("all");

  // Build filters
  const filters: ProductFilters = useMemo(() => {
    const f: ProductFilters = {};

    if (searchQuery) {
      f.search = searchQuery;
    }

    if (statusFilter !== "all") {
      f.status = statusFilter;
    }

    if (categoryFilter !== "all") {
      f.categoryId = categoryFilter;
    }

    if (newArrivalFilter !== "all") {
      f.isNewArrival = newArrivalFilter;
    }

    if (preOrderFilter !== "all") {
      f.isPreOrder = preOrderFilter;
    }

    // Parse price range
    if (priceRangeFilter !== "all") {
      const [min, max] = priceRangeFilter.split("-").map(Number);
      if (!isNaN(min)) f.minPrice = min;
      if (!isNaN(max)) f.maxPrice = max;
    }

    return f;
  }, [
    searchQuery,
    statusFilter,
    categoryFilter,
    priceRangeFilter,
    newArrivalFilter,
    preOrderFilter,
  ]);

  // Fetch products and categories
  const { data: products = [], isLoading: productsLoading } =
    useProducts(filters);
  const { data: categories = [] } = useCategories();
  const deleteProduct = useDeleteProduct();
  const createProduct = useCreateProduct();

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter(
      (p) => p.status === Status.ACTIVE
    ).length;
    const newArrivals = products.filter((p) => p.isNewArrival).length;
    const preOrders = products.filter((p) => p.isPreOrder).length;
    const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);
    const totalValue = products.reduce(
      (sum, p) => sum + p.price * p.stockQuantity,
      0
    );

    return [
      {
        title: "Total Produits",
        value: totalProducts.toString(),
        change: "",
        trend: "up" as const,
      },
      {
        title: "Produits Actifs",
        value: activeProducts.toString(),
        change: "",
        trend: "up" as const,
      },
      {
        title: "Nouvelles Arrivées",
        value: newArrivals.toString(),
        change: "",
        trend: "up" as const,
      },
      {
        title: "Produits à Venir",
        value: preOrders.toString(),
        change: "",
        trend: "up" as const,
      },
    ];
  }, [products]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(products.map((p) => p.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Produit supprimé avec succès");
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleDuplicate = async (product: any) => {
    try {
      // Récupérer le produit complet avec ses variants
      const response = await fetch(`/api/products/${product.id}`);
      if (!response.ok) {
        throw new Error("Impossible de récupérer les détails du produit");
      }
      const fullProduct = await response.json();

      // Préparer les données du produit dupliqué
      const duplicatedData = {
        name: `${fullProduct.name} (Copie)`,
        slug: `${fullProduct.slug}-copie-${Date.now()}`,
        description: fullProduct.description || undefined,
        shortDescription: fullProduct.shortDescription || undefined,
        barcode: undefined, // Nouveau code-barres à générer
        price: fullProduct.price,
        compareAtPrice: fullProduct.compareAtPrice || undefined,
        costPrice: fullProduct.costPrice || undefined,
        taxRate: fullProduct.taxRate || 0,
        status: Status.DRAFT, // Créer en brouillon pour révision
        featured: fullProduct.featured || false,
        isNewArrival: fullProduct.isNewArrival || false,
        isPreOrder: fullProduct.isPreOrder || false,
        trackInventory: fullProduct.trackInventory ?? true,
        stockQuantity: fullProduct.stockQuantity || 0,
        lowStockThreshold: fullProduct.lowStockThreshold || 10,
        weight: fullProduct.weight || undefined,
        length: fullProduct.length || undefined,
        width: fullProduct.width || undefined,
        height: fullProduct.height || undefined,
        categoryId: fullProduct.categoryId || undefined,
        images:
          fullProduct.images?.map((img: any, index: number) => ({
            url: img.url,
            alt: `${fullProduct.name} (Copie)`,
            sortOrder: img.sortOrder ?? index,
            isPrimary: img.isPrimary ?? index === 0,
          })) || [],
        variants:
          fullProduct.variants?.map((variant: any) => ({
            name: variant.name,
            sku: `${variant.sku}-copie-${Date.now()}`,
            price: variant.price || undefined,
            stock: variant.stock || 0,
            weight: variant.weight || undefined,
          })) || [],
      };

      await createProduct.mutateAsync(duplicatedData);
      toast.success("Produit dupliqué avec succès");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la duplication du produit");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setPriceRangeFilter("all");
    setNewArrivalFilter("all");
    setPreOrderFilter("all");
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    priceRangeFilter !== "all" ||
    newArrivalFilter !== "all" ||
    preOrderFilter !== "all";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight orbitron">Produits</h1>
        <Button asChild>
          <Link href="/ajouter-produits">
            <Plus className="size-4" />
            Ajouter un produit
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardDescription>{stat.title}</CardDescription>
                  <CardTitle className="font-semibold font-display text-2xl lg:text-3xl">
                    {stat.value}
                  </CardTitle>
                </div>
                <CardAction>
                  <Badge
                    variant="outline"
                    className={
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {stat.change}
                  </Badge>
                </CardAction>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="pt-4">
        <div className="w-full space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <div className="hidden gap-2 md:flex">
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as Status | "all")
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value={Status.ACTIVE}>Actif</SelectItem>
                    <SelectItem value={Status.DRAFT}>Brouillon</SelectItem>
                    <SelectItem value={Status.INACTIVE}>Inactif</SelectItem>
                    <SelectItem value={Status.ARCHIVED}>Archivé</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={priceRangeFilter}
                  onValueChange={setPriceRangeFilter}
                >
                  <SelectTrigger className="w-52 lg:w-auto">
                    <span className="text-muted-foreground text-sm">Prix:</span>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les prix</SelectItem>
                    <SelectItem value="0-10000">0 - 10 000 FCFA</SelectItem>
                    <SelectItem value="10000-50000">
                      10 000 - 50 000 FCFA
                    </SelectItem>
                    <SelectItem value="50000-100000">
                      50 000 - 100 000 FCFA
                    </SelectItem>
                    <SelectItem value="100000-500000">
                      100 000 - 500 000 FCFA
                    </SelectItem>
                    <SelectItem value="500000-">500 000+ FCFA</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={
                    newArrivalFilter === "all"
                      ? "all"
                      : newArrivalFilter
                        ? "true"
                        : "false"
                  }
                  onValueChange={(value) =>
                    setNewArrivalFilter(
                      value === "all" ? "all" : value === "true"
                    )
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Nouvelles arrivées" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="true">Nouvelles arrivées</SelectItem>
                    <SelectItem value="false">Autres</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={
                    preOrderFilter === "all"
                      ? "all"
                      : preOrderFilter
                        ? "true"
                        : "false"
                  }
                  onValueChange={(value) =>
                    setPreOrderFilter(
                      value === "all" ? "all" : value === "true"
                    )
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Produits à venir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="true">À venir</SelectItem>
                    <SelectItem value="false">Disponibles</SelectItem>
                  </SelectContent>
                </Select>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="default"
                    onClick={clearFilters}
                  >
                    <X className="size-4" />
                    Réinitialiser
                  </Button>
                )}
              </div>
              <div className="inline md:hidden">
                <Button variant="outline" size="icon">
                  <Funnel className="size-4" />
                </Button>
              </div>
            </div>
            <div className="ms-auto flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default">
                    <span className="hidden lg:inline">Colonnes</span>
                    <Columns2 className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Colonne 1</DropdownMenuItem>
                  <DropdownMenuItem>Colonne 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={
                        selectedRows.length === products.length &&
                        products.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Sélectionner tout"
                    />
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Nom du produit
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Prix
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Catégorie
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Stock
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">SKU</TableHead>
                  <TableHead className="text-muted-foreground">Note</TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Statut
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        <span>Chargement des produits...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-muted-foreground">
                          Aucun produit trouvé
                        </p>
                        {hasActiveFilters && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                          >
                            Réinitialiser les filtres
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(product.id)}
                          onCheckedChange={(checked) =>
                            handleSelectRow(product.id, checked === true)
                          }
                          aria-label="Sélectionner la ligne"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <figure className="rounded-lg border overflow-hidden bg-muted">
                            <Image
                              src={getProductImage(product)}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="object-cover"
                              unoptimized={isEdgeStoreImage(
                                getProductImage(product)
                              )}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/images/placeholder.png";
                              }}
                            />
                          </figure>
                          <div className="flex flex-col gap-1">
                            <div>{product.name}</div>
                            <div className="flex gap-1 flex-wrap">
                              {product.isNewArrival && (
                                <Badge
                                  variant="outline"
                                  className="w-fit text-xs border-purple-400 text-purple-600 bg-purple-50"
                                >
                                  <Sparkles className="size-3 mr-1" />
                                  Nouvelle arrivée
                                </Badge>
                              )}
                              {product.isPreOrder && (
                                <Badge
                                  variant="outline"
                                  className="w-fit text-xs border-blue-400 text-blue-600 bg-blue-50"
                                >
                                  <Clock className="size-3 mr-1" />
                                  Précommande
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatPrice(product.price)} FCFA
                        {product.compareAtPrice &&
                          product.compareAtPrice > product.price && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatPrice(product.compareAtPrice)} FCFA
                            </div>
                          )}
                      </TableCell>
                      <TableCell>
                        <div>{product.category?.name || "Sans catégorie"}</div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={
                            product.stockQuantity <= product.lowStockThreshold
                              ? "text-orange-600 font-medium"
                              : ""
                          }
                        >
                          {product.stockQuantity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {getProductSKU(product)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="size-4 fill-orange-400 text-orange-400" />
                            <span>{product.rating.toFixed(1)}</span>
                            {product.reviewCount > 0 && (
                              <span className="text-xs text-muted-foreground">
                                ({product.reviewCount})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <span className="sr-only">Ouvrir le menu</span>
                              <Ellipsis className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/produits-listes/${product.id}/edit`}>
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(product)}
                              disabled={createProduct.isPending}
                            >
                              {createProduct.isPending ? (
                                <>
                                  <Loader2 className="mr-2 size-4 animate-spin" />
                                  Duplication...
                                </>
                              ) : (
                                "Dupliquer"
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDelete(product.id)}
                              disabled={deleteProduct.isPending}
                            >
                              {deleteProduct.isPending ? (
                                <>
                                  <Loader2 className="mr-2 size-4 animate-spin" />
                                  Suppression...
                                </>
                              ) : (
                                "Supprimer"
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {selectedRows.length > 0 && (
                <span>
                  {selectedRows.length} sur {products.length} ligne(s)
                  sélectionnée(s).
                </span>
              )}
              {selectedRows.length === 0 && (
                <span>
                  {products.length} produit{products.length > 1 ? "s" : ""} au
                  total
                </span>
              )}
            </div>
            {/* Pagination can be added here when needed */}
          </div>
        </div>
      </div>

    </div>
  );
}
