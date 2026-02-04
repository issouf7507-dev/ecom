"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
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
import { Countdown } from "@/components/ui/countdown";
import { useEdgeStore } from "@/lib/edgestore";
import { useUpdateProduct, useProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Status } from "@/lib/constants/status";
import { toast } from "sonner";
import type { UpdateProductInput } from "@/lib/api/produits/types";

interface UploadedImage {
  url: string;
  file?: File;
  progress?: number;
}

export default function EditNewArrivalProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const { edgestore } = useEdgeStore();
  const updateProduct = useUpdateProduct();
  const { data: product, isLoading: productLoading } = useProduct(productId);
  const { data: categories = [] } = useCategories();

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
    status: string;
    categoryId: string;
    weight: string;
    length: string;
    width: string;
    height: string;
    availabilityDate: string;
    availabilityTime: string;
    isPreOrder: boolean;
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
    categoryId: "Aucune catégorie",
    weight: "",
    length: "",
    width: "",
    height: "",
    availabilityDate: "",
    availabilityTime: "",
    isPreOrder: true,
  });

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      const availabilityDate = product.availabilityDate
        ? new Date(product.availabilityDate).toISOString().split("T")[0]
        : "";
      const availabilityTime = product.availabilityTime || "";

      setFormData({
        name: product.name,
        slug: product.slug,
        sku: product.barcode || "",
        barcode: product.barcode || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        basePrice: product.price.toString(),
        discountedPrice: product.compareAtPrice?.toString() || "",
        costPrice: product.costPrice?.toString() || "",
        taxRate: product.taxRate.toString(),
        chargeTax: product.taxRate > 0,
        stockQuantity: product.stockQuantity.toString(),
        lowStockThreshold: product.lowStockThreshold.toString(),
        status: product.status ?? Status.ACTIVE,
        categoryId: product.categoryId || "Aucune catégorie",
        weight: product.weight?.toString() || "",
        length: product.length?.toString() || "",
        width: product.width?.toString() || "",
        height: product.height?.toString() || "",
        availabilityDate,
        availabilityTime,
        isPreOrder: product.isPreOrder,
      });

      if (product.images && product.images.length > 0) {
        setImages(
          product.images.map((img) => ({
            url: img.url,
            progress: 100,
          }))
        );
      }
    }
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

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

      if (formData.isPreOrder && !formData.availabilityDate) {
        toast.error(
          "La date de disponibilité est obligatoire pour les précommandes"
        );
        setIsSubmitting(false);
        return;
      }

      let availabilityDate: Date | undefined;
      if (formData.availabilityDate && formData.availabilityTime) {
        availabilityDate = new Date(
          `${formData.availabilityDate}T${formData.availabilityTime}:00`
        );
      } else if (formData.availabilityDate) {
        availabilityDate = new Date(`${formData.availabilityDate}T00:00:00`);
      }

      const updateData: UpdateProductInput = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        shortDescription: formData.shortDescription || undefined,
        barcode: formData.barcode || undefined,
        price: parseFloat(formData.basePrice),
        compareAtPrice: formData.discountedPrice
          ? parseFloat(formData.discountedPrice)
          : undefined,
        costPrice: formData.costPrice
          ? parseFloat(formData.costPrice)
          : undefined,
        taxRate: formData.chargeTax ? parseFloat(formData.taxRate) : 0,
        status: formData.status || "",
        isNewArrival: true,
        isPreOrder: formData.isPreOrder,
        availabilityDate: availabilityDate,
        availabilityTime: formData.availabilityTime || undefined,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        length: formData.length ? parseFloat(formData.length) : undefined,
        width: formData.width ? parseFloat(formData.width) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        categoryId:
          formData.categoryId && formData.categoryId !== "Aucune catégorie"
            ? formData.categoryId
            : undefined,
      };

      await updateProduct.mutateAsync({
        id: productId,
        data: updateData,
      });

      toast.success("Produit modifié avec succès");
      router.push("/nouvelles-arrivees");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la modification du produit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFullDateTime = () => {
    if (formData.availabilityDate && formData.availabilityTime) {
      return `${formData.availabilityDate}T${formData.availabilityTime}:00`;
    }
    return null;
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin" />
        <span className="ml-2">Chargement du produit...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Produit non trouvé</p>
        <Button asChild className="mt-4">
          <Link href="/nouvelles-arrivees">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/nouvelles-arrivees">
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Sparkles className="size-6 text-purple-500" />
              <h1 className="text-2xl font-bold tracking-tight orbitron">
                Modifier la nouvelle arrivée
              </h1>
            </div>
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
              type="submit"
              variant="default"
              disabled={isSubmitting || uploadingImages.length > 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          <div className="space-y-4 lg:col-span-4">
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
          </div>

          <div className="space-y-4 lg:col-span-2">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-blue-500" />
                  <CardTitle>Disponibilité</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPreOrder"
                      checked={formData.isPreOrder}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isPreOrder: checked === true,
                        }))
                      }
                    />
                    <Label htmlFor="isPreOrder">Activer la précommande</Label>
                  </div>
                  {formData.isPreOrder && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="availabilityDate">
                          Date de disponibilité{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="availabilityDate"
                          name="availabilityDate"
                          type="date"
                          value={formData.availabilityDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                          required={formData.isPreOrder}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="availabilityTime">
                          Heure de disponibilité
                        </Label>
                        <Input
                          id="availabilityTime"
                          name="availabilityTime"
                          type="time"
                          value={formData.availabilityTime}
                          onChange={handleInputChange}
                        />
                      </div>
                      {getFullDateTime() && (
                        <div className="rounded-lg border bg-white p-4">
                          <p className="mb-2 text-xs text-muted-foreground">
                            Aperçu du compte à rebours:
                          </p>
                          <Countdown
                            targetDate={getFullDateTime()!}
                            className="justify-center"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

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

            <Card>
              <CardHeader>
                <CardTitle>Statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Select
                    value={formData.status || Status.ACTIVE}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
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

            <Card>
              <CardHeader>
                <CardTitle>Catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Select
                    value={product.categoryId || "Aucune catégorie"}
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
