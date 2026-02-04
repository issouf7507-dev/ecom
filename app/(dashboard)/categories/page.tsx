"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Funnel,
  ArrowUpDown,
  Ellipsis,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Edit,
  Trash2,
  Copy,
  Eye,
  Loader2,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  useCategories,
  useCategoryStats,
  useDeleteCategory,
  useUpdateCategory,
  useCreateCategory,
  useCategory,
} from "@/hooks/useCategories";
import { Status } from "@/lib/constants/status";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const getStatusBadge = (status: Status) => {
  const statusMap: Record<Status, { className: string; label: string }> = {
    ACTIVE: {
      className:
        "border-green-400 bg-green-50 text-green-800 dark:bg-green-900/70 dark:text-white/80",
      label: "Actif",
    },
    ARCHIVED: {
      className:
        "border-gray-400 bg-gray-50 text-gray-800 dark:bg-gray-900/70 dark:text-white/80",
      label: "Archivé",
    },
    DRAFT: {
      className:
        "border-orange-400 bg-orange-50 text-orange-800 dark:bg-orange-900/70 dark:text-white/80",
      label: "Brouillon",
    },
    INACTIVE: {
      className:
        "border-red-400 bg-red-50 text-red-800 dark:bg-red-900/70 dark:text-white/80",
      label: "Inactif",
    },
  };

  const statusConfig = statusMap[status] || statusMap.ACTIVE;
  return (
    <Badge className={`capitalize ${statusConfig.className}`}>
      {statusConfig.label}
    </Badge>
  );
};

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function CategoriesPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Form state for edit/duplicate
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    status: Status;
  }>({
    name: "",
    slug: "",
    description: "",
    status: Status.ACTIVE,
  });

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Build filters
  const filters = useMemo(() => {
    const filter: any = {};
    if (debouncedSearch) {
      filter.search = debouncedSearch;
    }
    if (statusFilter !== "all") {
      filter.status = statusFilter as Status;
    }
    return filter;
  }, [debouncedSearch, statusFilter]);

  // Fetch categories and stats
  const { data: categories = [], isLoading, error } = useCategories(filters);
  const { data: stats, isLoading: statsLoading } = useCategoryStats();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();
  const createCategory = useCreateCategory();
  const { data: selectedCategory } = useCategory(selectedCategoryId || undefined);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(categories.map((c) => c.id));
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

  // Handlers for modals
  const handleView = (id: string) => {
    setSelectedCategoryId(id);
    setViewModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setSelectedCategoryId(id);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        status: category.status,
      });
      setEditModalOpen(true);
    }
  };

  const handleDuplicate = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setSelectedCategoryId(id);
      setFormData({
        name: `${category.name} (Copie)`,
        slug: `${category.slug}-copy`,
        description: category.description || "",
        status: category.status,
      });
      setDuplicateModalOpen(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedCategoryId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategoryId) return;

    try {
      await deleteCategory.mutateAsync(selectedCategoryId);
      toast.success("Catégorie supprimée avec succès");
      setSelectedRows(selectedRows.filter((rowId) => rowId !== selectedCategoryId));
      setDeleteModalOpen(false);
      setSelectedCategoryId(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedCategoryId) return;

    try {
      await updateCategory.mutateAsync({
        id: selectedCategoryId,
        data: formData,
      });
      toast.success("Catégorie modifiée avec succès");
      setEditModalOpen(false);
      setSelectedCategoryId(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la modification");
    }
  };

  const handleDuplicateSubmit = async () => {
    try {
      await createCategory.mutateAsync(formData);
      toast.success("Catégorie dupliquée avec succès");
      setDuplicateModalOpen(false);
      setSelectedCategoryId(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la duplication");
    }
  };

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Format stats for display
  const formattedStats = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: "Total Catégories",
        value: stats.total.toString(),
        change: "",
        trend: "neutral" as const,
      },
      {
        title: "Catégories Actives",
        value: stats.active.toString(),
        change: "",
        trend: "neutral" as const,
      },
      {
        title: "Produits Total",
        value: stats.totalProducts.toLocaleString(),
        change: "",
        trend: "neutral" as const,
      },
      {
        title: "Catégories Archivées",
        value: stats.archived.toString(),
        change: "",
        trend: "neutral" as const,
      },
    ];
  }, [stats]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight orbitron">
          Catégories
        </h1>
        <Button asChild>
          <Link href="/categories/create">
            <Plus className="size-4" />
            Ajouter une catégorie
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted animate-pulse rounded w-24" />
                      <div className="h-8 bg-muted animate-pulse rounded w-16" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          : formattedStats.map((stat) => (
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
                            stat.trend === "up"
                              ? "text-green-600"
                              : "text-red-600"
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
                placeholder="Rechercher des catégories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <div className="hidden gap-2 md:flex">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="ARCHIVED">Archivé</SelectItem>
                    <SelectItem value="DRAFT">Brouillon</SelectItem>
                    <SelectItem value="INACTIVE">Inactif</SelectItem>
                  </SelectContent>
                </Select>
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
                  <DropdownMenuItem>Toutes les colonnes</DropdownMenuItem>
                  <DropdownMenuItem>Colonnes personnalisées</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">
                    <Checkbox
                      checked={
                        selectedRows.length === categories.length &&
                        categories.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Nom de la catégorie
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">Slug</TableHead>
                  <TableHead className="text-muted-foreground">
                    Description
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Nombre de produits
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <Button variant="ghost" size="sm" className="-ml-3">
                      Statut
                      <ArrowUpDown className="ml-2 size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Chargement des catégories...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Erreur lors du chargement des catégories.
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Aucune catégorie trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(category.id)}
                          onCheckedChange={(checked) =>
                            handleSelectRow(category.id, checked === true)
                          }
                          aria-label="Select row"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="font-medium">{category.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-muted-foreground truncate">
                          {category.description || "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {category.productCount || 0}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(category.status)}</TableCell>
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
                            <DropdownMenuItem
                              onClick={() => handleView(category.id)}
                              className="flex items-center cursor-pointer"
                            >
                              <Eye className="mr-2 size-4" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(category.id)}
                              className="flex items-center cursor-pointer"
                            >
                              <Edit className="mr-2 size-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(category.id)}
                              className="flex items-center cursor-pointer"
                            >
                              <Copy className="mr-2 size-4" />
                              Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDeleteClick(category.id)}
                              disabled={deleteCategory.isPending}
                              className="flex items-center cursor-pointer"
                            >
                              <Trash2 className="mr-2 size-4" />
                              Supprimer
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
              {selectedRows.length} sur {categories.length} ligne(s)
              sélectionnée(s).
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="size-4" />
                Précédent
              </Button>
              <Button variant="outline" size="sm" disabled>
                Suivant
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la catégorie</DialogTitle>
            <DialogDescription>
              Informations complètes sur la catégorie
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Nom</Label>
                  <p className="text-sm font-medium">{selectedCategory.name}</p>
                </div>
                <div className="grid gap-2">
                  <Label>Slug</Label>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {selectedCategory.slug}
                  </code>
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedCategory.description || "Aucune description"}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label>Statut</Label>
                  {getStatusBadge(selectedCategory.status)}
                </div>
                <div className="grid gap-2">
                  <Label>Nombre de produits</Label>
                  <p className="text-sm font-medium">
                    {selectedCategory.productCount || 0}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label>Date de création</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedCategory.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label>Dernière modification</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedCategory.updatedAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la catégorie
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">
                Nom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                    slug: prev.slug || generateSlug(e.target.value),
                  }));
                }}
                placeholder="Nom de la catégorie"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-slug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="slug-de-la-categorie"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description de la catégorie"
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as Status }))
                }
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Status.ACTIVE}>Actif</SelectItem>
                  <SelectItem value={Status.INACTIVE}>Inactif</SelectItem>
                  <SelectItem value={Status.DRAFT}>Brouillon</SelectItem>
                  <SelectItem value={Status.ARCHIVED}>Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              disabled={updateCategory.isPending}
            >
              Annuler
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={updateCategory.isPending || !formData.name || !formData.slug}
            >
              {updateCategory.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Modal */}
      <Dialog open={duplicateModalOpen} onOpenChange={setDuplicateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dupliquer la catégorie</DialogTitle>
            <DialogDescription>
              Créez une copie de cette catégorie avec de nouvelles informations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dup-name">
                Nom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dup-name"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                    slug: prev.slug || generateSlug(e.target.value),
                  }));
                }}
                placeholder="Nom de la catégorie"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dup-slug">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dup-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="slug-de-la-categorie"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dup-description">Description</Label>
              <Textarea
                id="dup-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description de la catégorie"
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dup-status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as Status }))
                }
              >
                <SelectTrigger id="dup-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Status.ACTIVE}>Actif</SelectItem>
                  <SelectItem value={Status.INACTIVE}>Inactif</SelectItem>
                  <SelectItem value={Status.DRAFT}>Brouillon</SelectItem>
                  <SelectItem value={Status.ARCHIVED}>Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDuplicateModalOpen(false)}
              disabled={createCategory.isPending}
            >
              Annuler
            </Button>
            <Button
              onClick={handleDuplicateSubmit}
              disabled={createCategory.isPending || !formData.name || !formData.slug}
            >
              {createCategory.isPending ? "Création..." : "Créer la copie"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la catégorie</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action
              est irréversible.
              {selectedCategory && (
                <span className="block mt-2 font-semibold text-foreground">
                  Catégorie : {selectedCategory.name}
                </span>
              )}
              {selectedCategory && selectedCategory.productCount && selectedCategory.productCount > 0 && (
                <span className="block mt-2 text-orange-600">
                  ⚠️ Attention : Cette catégorie contient {selectedCategory.productCount} produit(s).
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleteCategory.isPending}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteCategory.isPending}
            >
              {deleteCategory.isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
