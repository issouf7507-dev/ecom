"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Image as ImageIcon,
  Upload,
  CirclePlus,
  X,
  Loader2,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useEdgeStore } from "@/lib/edgestore";
import {
  useProducts,
  useCreateProduct,
  useDeleteProduct,
} from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Status } from "@prisma/client";
import { toast } from "sonner";
import type { CreateProductInput, Product } from "@/lib/api/produits/types";

interface UploadedImage {
  url: string;
  file?: File;
  progress?: number;
}

export default function NewArrivalsPage() {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  // Fetch new arrivals products
  const { data: products = [], isLoading } = useProducts({
    isNewArrival: true,
  });
  const { data: categories = [] } = useCategories();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    sku: string;
    barcode: string;
    description: string;
    shortDescription: string;
    basePrice: string;
    discountedPrice: string;
    costPrice: string;
    taxRate: string;
    chargeTax: boolean;
    stockQuantity: string;
    lowStockThreshold: string;
    status: Status;
    categoryId: string;
    weight: string;
    length: string;
    width: string;
    height: string;
  }>({
    name: "",
    slug: "",
    sku: "",
    barcode: "",
    description: "",
    shortDescription: "",
    basePrice: "",
    discountedPrice: "",
    costPrice: "",
    taxRate: "0",
    chargeTax: false,
    stockQuantity: "0",
    lowStockThreshold: "10",
    status: Status.ACTIVE,
    categoryId: "",
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<
    Array<{ name: string; sku: string; price: string; stock: string }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Auto-generate SKU from slug
  const generateSKU = (slug: string) => {
    if (!slug) return "";
    const slugUpper = slug.toUpperCase().replace(/-/g, "");
    return `SKU-${slugUpper}`;
  };

  // Filter products by search
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query) ||
        (p.barcode && p.barcode.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      sku: "",
      barcode: "",
      description: "",
      shortDescription: "",
      basePrice: "",
      discountedPrice: "",
      costPrice: "",
      taxRate: "0",
      chargeTax: false,
      stockQuantity: "0",
      lowStockThreshold: "10",
      status: Status.ACTIVE,
      categoryId: "",
      weight: "",
      length: "",
      width: "",
      height: "",
    });
    setImages([]);
    setVariants([]);
  };

  // Open create modal
  const handleCreateClick = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

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
        status: Status.DRAFT, // Set as draft by default
        isNewArrival: true, // Keep as new arrival
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

  // Form handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "name") {
        const newSlug = generateSlug(value);
        updated.slug = newSlug;
        updated.sku = generateSKU(newSlug);
      }
      return updated;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? (value as Status) : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 4) {
      toast.error("Vous ne pouvez ajouter que 4 images maximum");
      return;
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`L'image ${file.name} est trop grande (max 5MB)`);
        continue;
      }

      const tempImage: UploadedImage = {
        url: URL.createObjectURL(file),
        file,
        progress: 0,
      };

      setImages((prev) => [...prev, tempImage]);
      setUploadingImages((prev) => [...prev, tempImage.url]);

      try {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            setImages((prev) =>
              prev.map((img) =>
                img.url === tempImage.url ? { ...img, progress } : img
              )
            );
          },
        });

        setImages((prev) =>
          prev.map((img) =>
            img.url === tempImage.url
              ? { ...img, url: res.url, progress: 100 }
              : img
          )
        );
        toast.success(`Image ${file.name} uploadée avec succès`);
      } catch (error: any) {
        toast.error(`Erreur lors de l'upload de ${file.name}`);
        setImages((prev) => prev.filter((img) => img.url !== tempImage.url));
      } finally {
        setUploadingImages((prev) =>
          prev.filter((url) => url !== tempImage.url)
        );
      }
    }
  };

  const removeImage = async (index: number) => {
    const image = images[index];
    if (image.url.startsWith("http") && !image.url.includes("blob:")) {
      try {
        await edgestore.publicFiles.delete({ url: image.url });
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { name: "", sku: "", price: "", stock: "0" }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Submit handlers
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (uploadingImages.length > 0) {
        toast.info("Veuillez attendre la fin de l'upload des images");
        setIsSubmitting(false);
        return;
      }

      if (!formData.name || !formData.slug) {
        toast.error("Le nom et le slug sont obligatoires");
        setIsSubmitting(false);
        return;
      }

      if (!formData.basePrice) {
        toast.error("Le prix de base est obligatoire");
        setIsSubmitting(false);
        return;
      }

      const finalSlug = formData.slug || generateSlug(formData.name);
      const finalSKU = formData.sku || generateSKU(finalSlug);

      const productData: CreateProductInput = {
        name: formData.name,
        slug: finalSlug,
        description: formData.description || undefined,
        shortDescription: formData.shortDescription || undefined,
        barcode: formData.barcode || finalSKU || undefined,
        price: parseFloat(formData.basePrice),
        compareAtPrice: formData.discountedPrice
          ? parseFloat(formData.discountedPrice)
          : undefined,
        costPrice: formData.costPrice
          ? parseFloat(formData.costPrice)
          : undefined,
        taxRate: formData.chargeTax ? parseFloat(formData.taxRate) : 0,
        status: formData.status,
        isNewArrival: true, // Always true for new arrivals
        trackInventory: true,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        length: formData.length ? parseFloat(formData.length) : undefined,
        width: formData.width ? parseFloat(formData.width) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        categoryId: formData.categoryId || undefined,
        images: images.map((img, index) => ({
          url: img.url,
          alt: formData.name,
          sortOrder: index,
          isPrimary: index === 0,
        })),
        variants: variants
          .filter((v) => v.name && v.sku)
          .map((variant) => ({
            name: variant.name,
            sku: variant.sku,
            price: variant.price ? parseFloat(variant.price) : undefined,
            stock: parseInt(variant.stock) || 0,
          })),
      };

      await createProduct.mutateAsync(productData);
      toast.success("Produit créé avec succès");
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création du produit");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Product form component
  const ProductForm = ({
    onSubmit,
    submitLabel,
  }: {
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-6">
        {/* Left Column */}
        <div className="space-y-4 lg:col-span-4">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Détails du produit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    Nom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nom du produit"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="slug-du-produit"
                    required
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="barcode">Code-barres</Label>
                  <Input
                    id="barcode"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                    placeholder="123456789"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="shortDescription">Description courte</Label>
                  <Input
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Description courte du produit"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description complète du produit"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>
                Images du produit{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({images.length}/4)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {images.length < 4 && (
                  <div className="relative flex min-h-32 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4">
                    <input
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      multiple
                      className="sr-only"
                      type="file"
                      onChange={handleFileChange}
                      disabled={uploadingImages.length > 0}
                    />
                    <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                      <div className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background">
                        <ImageIcon className="size-4 opacity-60" />
                      </div>
                      <p className="mb-1.5 text-sm font-medium">
                        Glissez vos images ici
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG ou WEBP (max. 5MB) - Maximum 4 images
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          const input = document.querySelector(
                            'input[type="file"]'
                          ) as HTMLInputElement;
                          input?.click();
                        }}
                        disabled={uploadingImages.length > 0}
                      >
                        <Upload className="-ms-1 size-4 opacity-60" />
                        Sélectionner des images
                      </Button>
                    </div>
                  </div>
                )}

                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="group relative aspect-square overflow-hidden rounded-lg border"
                      >
                        <img
                          src={image.url}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {image.progress !== undefined &&
                          image.progress < 100 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                              <Loader2 className="size-6 animate-spin text-white" />
                            </div>
                          )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => removeImage(index)}
                          disabled={uploadingImages.includes(image.url)}
                        >
                          <X className="size-4" />
                        </Button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                            Principale
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Variantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="grid gap-4 rounded-lg border p-4 lg:grid-flow-col"
                  >
                    <div className="grid gap-2">
                      <Label>Nom de la variante</Label>
                      <Input
                        value={variant.name}
                        onChange={(e) =>
                          handleVariantChange(index, "name", e.target.value)
                        }
                        placeholder="Ex: Taille: Large, Couleur: Rouge"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>SKU</Label>
                      <Input
                        value={variant.sku}
                        onChange={(e) =>
                          handleVariantChange(index, "sku", e.target.value)
                        }
                        placeholder="SKU-VARIANT-001"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Prix (optionnel)</Label>
                      <Input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(index, "price", e.target.value)
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(index, "stock", e.target.value)
                        }
                        placeholder="0"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(index)}
                      className="self-end"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
                {variants.length === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    Aucune variante. Cliquez sur "Ajouter une variante" pour en
                    ajouter.
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-center border-t p-0">
              <Button
                type="button"
                variant="ghost"
                className="w-full rounded-tl-none rounded-tr-none"
                onClick={addVariant}
              >
                <CirclePlus className="size-4" />
                Ajouter une variante
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Tarification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="basePrice">
                    Prix de base <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="basePrice"
                    name="basePrice"
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discountedPrice">Prix réduit</Label>
                  <Input
                    id="discountedPrice"
                    name="discountedPrice"
                    type="number"
                    step="0.01"
                    value={formData.discountedPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="costPrice">Prix de revient</Label>
                  <Input
                    id="costPrice"
                    name="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="chargeTax"
                    checked={formData.chargeTax}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        chargeTax: checked === true,
                      }))
                    }
                  />
                  <Label htmlFor="chargeTax">Appliquer la taxe</Label>
                </div>
                {formData.chargeTax && (
                  <div className="grid gap-2">
                    <Label htmlFor="taxRate">Taux de taxe (%)</Label>
                    <Input
                      id="taxRate"
                      name="taxRate"
                      type="number"
                      step="0.01"
                      value={formData.taxRate}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                )}
                <Separator />
                <div className="grid gap-2">
                  <Label htmlFor="stockQuantity">Quantité en stock</Label>
                  <Input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lowStockThreshold">
                    Seuil d'alerte stock
                  </Label>
                  <Input
                    id="lowStockThreshold"
                    name="lowStockThreshold"
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={handleInputChange}
                    placeholder="10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Statut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Status.DRAFT}>Brouillon</SelectItem>
                    <SelectItem value={Status.ACTIVE}>Actif</SelectItem>
                    <SelectItem value={Status.INACTIVE}>Inactif</SelectItem>
                    <SelectItem value={Status.ARCHIVED}>Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Catégorie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    handleSelectChange("categoryId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aucune catégorie">
                      Aucune catégorie
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Dimensions */}
          <Card>
            <CardHeader>
              <CardTitle>Dimensions & Poids</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="length">Longueur (cm)</Label>
                    <Input
                      id="length"
                      name="length"
                      type="number"
                      step="0.01"
                      value={formData.length}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="width">Largeur (cm)</Label>
                    <Input
                      id="width"
                      name="width"
                      type="number"
                      step="0.01"
                      value={formData.width}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="height">Hauteur (cm)</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      step="0.01"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateModalOpen(false);
            resetForm();
          }}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || uploadingImages.length > 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight orbitron">
              Nouvelles Arrivées
            </h1>
            <p className="text-sm text-muted-foreground">
              Gérez les produits marqués comme nouvelles arrivées
            </p>
          </div>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 size-4" />
          Ajouter un produit
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge variant="outline" className="ml-auto">
          {filteredProducts.length} produit
          {filteredProducts.length > 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des produits</CardTitle>
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
                {searchQuery
                  ? "Aucun produit trouvé"
                  : "Aucun produit nouvelle arrivée"}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateClick} className="mt-4">
                  <Plus className="mr-2 size-4" />
                  Ajouter le premier produit
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative size-12 overflow-hidden rounded">
                        <Image
                          src={getProductImage(product)}
                          alt={product.name}
                          fill
                          className="object-cover"
                          unoptimized={getProductImage(product).includes(
                            "files.edgestore.dev"
                          )}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{formatPrice(product.price)} FCFA</TableCell>
                    <TableCell>{product.stockQuantity}</TableCell>
                    <TableCell>{product.category?.name || "Aucune"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === Status.ACTIVE
                            ? "default"
                            : "secondary"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Eye className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/nouvelles-arrivees/${product.id}/edit`}>
                              <Edit className="mr-2 size-4" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicateClick(product)}
                          >
                            <Copy className="mr-2 size-4" />
                            Dupliquer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(product.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 size-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un produit nouvelle arrivée</DialogTitle>
            <DialogDescription>
              Créez un nouveau produit marqué comme nouvelle arrivée
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleCreateSubmit}
            submitLabel="Créer le produit"
          />
        </DialogContent>
      </Dialog>

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
