"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  Clock,
  Loader2,
  X,
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
  CardContent,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Countdown } from "@/components/ui/countdown";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Status } from "@prisma/client";
import { toast } from "sonner";
import type { CreateProductInput, Product } from "@/lib/api/produits/types";

const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
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

const getProductImage = (product: Product) => {
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find((img) => img.isPrimary);
    return (
      primaryImage?.url || product.images[0]?.url || "/images/placeholder.png"
    );
  }
  return "/images/placeholder.png";
};

const getFullDateTime = (product: Product) => {
  if (product.availabilityDate && product.availabilityTime) {
    const date = new Date(product.availabilityDate);
    const [hours, minutes] = product.availabilityTime.split(":");
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toISOString();
  } else if (product.availabilityDate) {
    return new Date(product.availabilityDate).toISOString();
  }
  return null;
};

export default function UpcomingProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Fetch upcoming products
  const { data: products = [], isLoading } = useProducts({
    isPreOrder: true,
  });
  const { data: categories = [] } = useCategories();
  const deleteProduct = useDeleteProduct();
  const createProduct = useCreateProduct();

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.slug.toLowerCase().includes(query) ||
          (p.barcode && p.barcode.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.categoryId === categoryFilter);
    }

    return filtered;
  }, [products, searchQuery, statusFilter, categoryFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter(
      (p) => p.status === Status.ACTIVE
    ).length;
    const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);

    // Find next availability date
    const upcomingDates = products
      .filter((p) => p.availabilityDate)
      .map((p) => new Date(p.availabilityDate!))
      .sort((a, b) => a.getTime() - b.getTime());

    const nextDate = upcomingDates[0]
      ? upcomingDates[0].toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
        })
      : "Aucune";

    return [
      {
        title: "Produits à Venir",
        value: totalProducts.toString(),
        change: `+${activeProducts} actifs`,
        trend: "up" as const,
      },
      {
        title: "Stock Total",
        value: totalStock.toString(),
        change: "",
        trend: "neutral" as const,
      },
      {
        title: "Prochaine Sortie",
        value: nextDate,
        change: "",
        trend: "neutral" as const,
      },
    ];
  }, [products]);

  // Handle duplicate
  const handleDuplicateClick = async (product: Product) => {
    try {
      const duplicateData: CreateProductInput = {
        name: `${product.name} (Copie)`,
        slug: `${product.slug}-copie-${Date.now()}`,
        description: product.description || undefined,
        shortDescription: product.shortDescription || undefined,
        barcode: product.barcode ? `${product.barcode}-COPY` : undefined,
        price: product.price,
        compareAtPrice: product.compareAtPrice || undefined,
        costPrice: product.costPrice || undefined,
        taxRate: product.taxRate,
        status: Status.DRAFT,
        isPreOrder: true,
        availabilityDate: product.availabilityDate
          ? new Date(product.availabilityDate)
          : undefined,
        availabilityTime: product.availabilityTime || undefined,
        trackInventory: product.trackInventory,
        stockQuantity: product.stockQuantity,
        lowStockThreshold: product.lowStockThreshold,
        weight: product.weight || undefined,
        length: product.length || undefined,
        width: product.width || undefined,
        height: product.height || undefined,
        categoryId: product.categoryId || undefined,
        images:
          product.images && product.images.length > 0
            ? product.images.map((img, index) => ({
                url: img.url,
                alt: `${product.name} (Copie)`,
                sortOrder: index,
                isPrimary: index === 0,
              }))
            : undefined,
      };

      await createProduct.mutateAsync(duplicateData);
      toast.success("Produit dupliqué avec succès");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la duplication");
    }
  };

  // Handle delete
  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct.mutateAsync(productToDelete);
      toast.success("Produit supprimé avec succès");
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center gap-3">
          <Clock className="size-6 text-blue-500" />
          <h1 className="text-2xl font-bold tracking-tight orbitron">
            Produits à Venir
          </h1>
        </div>
        <Button asChild>
          <Link href="/produits-a-venir/create">
            <Plus className="size-4" />
            Ajouter un produit à venir
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                {stat.trend !== "neutral" && stat.change && (
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
                )}
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
                placeholder="Rechercher des produits à venir..."
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
                  <SelectTrigger className="w-[180px]">
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
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(searchQuery ||
                  statusFilter !== "all" ||
                  categoryFilter !== "all") && (
                  <Button
                    variant="outline"
                    size="default"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setCategoryFilter("all");
                    }}
                  >
                    <X className="size-4" />
                    Réinitialiser
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des produits à venir</CardTitle>
              <CardDescription>
                {filteredProducts.length} produit
                {filteredProducts.length > 1 ? "s" : ""} trouvé
                {filteredProducts.length > 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-6 animate-spin" />
                  <span className="ml-2">Chargement...</span>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery ||
                    statusFilter !== "all" ||
                    categoryFilter !== "all"
                      ? "Aucun produit trouvé"
                      : "Aucun produit à venir"}
                  </p>
                  {!searchQuery &&
                    statusFilter === "all" &&
                    categoryFilter === "all" && (
                      <Button asChild className="mt-4">
                        <Link href="/produits-a-venir/create">
                          <Plus className="mr-2 size-4" />
                          Ajouter le premier produit
                        </Link>
                      </Button>
                    )}
                </div>
              ) : (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Date de disponibilité</TableHead>
                        <TableHead>Compte à rebours</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => {
                        const countdownDate = getFullDateTime(product);
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="relative size-12 overflow-hidden rounded">
                                <Image
                                  src={getProductImage(product)}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  unoptimized={getProductImage(
                                    product
                                  ).includes("files.edgestore.dev")}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="font-medium">
                                  {product.name}
                                </div>
                                {product.isPreOrder && (
                                  <Badge
                                    variant="outline"
                                    className="w-fit mt-1 text-xs border-blue-400 text-blue-600"
                                  >
                                    <Clock className="size-3 mr-1" />
                                    Précommande
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-semibold">
                                  {formatPrice(product.price)} FCFA
                                </span>
                                {product.compareAtPrice && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    {formatPrice(product.compareAtPrice)} FCFA
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{product.stockQuantity}</TableCell>
                            <TableCell>
                              {product.category?.name || "Aucune"}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {formatDate(product.availabilityDate)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {countdownDate ? (
                                <Countdown
                                  targetDate={countdownDate}
                                  className="text-blue-600"
                                />
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  N/A
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(product.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Eye className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/produits-a-venir/${product.id}/edit`
                                      )
                                    }
                                  >
                                    <Edit className="mr-2 size-4" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDuplicateClick(product)
                                    }
                                  >
                                    <Copy className="mr-2 size-4" />
                                    Dupliquer
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteClick(product.id)
                                    }
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 size-4" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous sûr ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Le produit sera définitivement
              supprimé.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setProductToDelete(null);
              }}
              disabled={deleteProduct.isPending}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
