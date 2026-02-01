"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Image as ImageIcon,
  Upload,
  CirclePlus,
  X,
  Loader2,
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
  CardAction,
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
import { useEdgeStore } from "@/lib/edgestore";
import { useCreateProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Status } from "@prisma/client";
import { toast } from "sonner";

interface UploadedImage {
  url: string;
  file: File;
  progress?: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const createProduct = useCreateProduct();
  const { data: categories = [] } = useCategories();

  const [formData, setFormData] = useState({
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
    inStock: true,
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug and SKU when name changes
      if (name === "name") {
        const newSlug = generateSlug(value);
        updated.slug = newSlug;
        updated.sku = generateSKU(newSlug);
      }
      return updated;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (image.url.startsWith("http")) {
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

  const handleSubmit = async (e: React.FormEvent, status: string) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Wait for all images to finish uploading
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

      // Ensure slug and SKU are generated if not already set
      const finalSlug = formData.slug || generateSlug(formData.name);
      const finalSKU = formData.sku || generateSKU(finalSlug);

      const productData = {
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
        status: status,
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

      // console.log(productData);

      await createProduct.mutateAsync(productData);
      toast.success(
        status === Status.DRAFT
          ? "Produit enregistré comme brouillon"
          : "Produit créé avec succès"
      );
      router.push("/produits-listes");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création du produit");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={(e) => handleSubmit(e, Status.ACTIVE)}>
        {/* Header */}
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard">
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight orbitron">
              Ajouter un produit
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, Status.DRAFT)}
              disabled={isSubmitting || uploadingImages.length > 0}
            >
              Enregistrer comme brouillon
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting || uploadingImages.length > 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Publication...
                </>
              ) : (
                "Publier"
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          {/* Left Column - Main Content */}
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
                    <p className="text-xs text-muted-foreground">
                      Généré automatiquement à partir du nom
                    </p>
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
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Images du produit{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({images.length}/4)
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Upload Area */}
                  {images.length < 4 && (
                    <div className="relative flex min-h-32 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors">
                      <input
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        multiple
                        className="sr-only"
                        aria-label="Upload image file"
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

                  {/* Image Preview Grid */}
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
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune variante. Cliquez sur "Ajouter une variante" pour
                      en ajouter.
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

          {/* Right Column - Sidebar */}
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
                    <Label
                      htmlFor="chargeTax"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Appliquer la taxe sur ce produit
                    </Label>
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
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
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
                  <p className="text-sm text-muted-foreground">
                    Définir le statut du produit.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
      </form>
    </div>
  );
}
