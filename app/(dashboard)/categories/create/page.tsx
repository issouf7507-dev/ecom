"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Image as ImageIcon,
  Upload,
  FolderPlus,
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
import { useCreateCategory, useCategories } from "@/hooks/useCategories";
import { Status } from "@/lib/constants/status";
import { toast } from "sonner";

// Client-only wrapper for Select to prevent hydration errors
function ClientOnlySelect({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default function CreateCategoryPage() {
  const router = useRouter();
  const createCategory = useCreateCategory();
  const { data: categories = [] } = useCategories();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    parentId: "",
    status: "ACTIVE",
    sortOrder: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || undefined,
        image: formData.image || undefined,
        parentId: formData.parentId || undefined,
        status: formData.status,
        sortOrder: formData.sortOrder,
      };

      await createCategory.mutateAsync(data);
      toast.success("Catégorie créée avec succès");
      router.push("/categories");
    } catch (error: any) {
      toast.error(
        error.message || "Erreur lors de la création de la catégorie"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);

    try {
      const data = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || undefined,
        image: formData.image || undefined,
        parentId: formData.parentId || undefined,
        status: Status.DRAFT,
        sortOrder: formData.sortOrder,
      };

      await createCategory.mutateAsync(data);
      toast.success("Catégorie enregistrée comme brouillon");
      router.push("/categories");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/categories">
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <FolderPlus className="size-6 text-blue-500" />
              <h1 className="text-2xl font-bold tracking-tight orbitron">
                Ajouter une catégorie
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
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              Enregistrer comme brouillon
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer la catégorie"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          {/* Left Column - Main Content */}
          <div className="space-y-4 lg:col-span-4">
            {/* Category Details */}
            <Card>
              <CardHeader>
                <CardTitle>Détails de la catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      Nom de la catégorie{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleNameChange}
                      placeholder="Ex: Électronique"
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
                      placeholder="ex: electronique"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      L'URL de la catégorie. Généré automatiquement à partir du
                      nom si vide.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Description de la catégorie"
                      rows={4}
                    />
                  </div>

                  {/* <div className="grid gap-2">
                    <Label htmlFor="image">Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="size-4" />
                      </Button>
                    </div>
                    {formData.image && (
                      <div className="mt-2">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="h-32 w-32 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-4 lg:col-span-2">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Paramètres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Statut</Label>

                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Actif</SelectItem>
                      <SelectItem value="INACTIVE">Inactif</SelectItem>
                      <SelectItem value="DRAFT">Brouillon</SelectItem>
                      <SelectItem value="ARCHIVED">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="parentId">Catégorie parente</Label>
                  {/* <ClientOnlySelect
                    fallback={
                      <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        Chargement...
                      </div>
                    }
                  >
                    <Select
                      value={formData.parentId}
                      onValueChange={(value) =>
                        handleSelectChange("parentId", value)
                      }
                    >
                      <SelectTrigger id="parentId">
                        <SelectValue placeholder="Aucune (catégorie principale)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
                          Aucune (catégorie principale)
                        </SelectItem>
                        {categories
                          .filter((cat) => cat.id !== formData.parentId)
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </ClientOnlySelect> */}
                </div>

                {/* <div className="grid gap-2">
                  <Label htmlFor="sortOrder">Ordre de tri</Label>
                  <Input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Les catégories avec un ordre plus petit apparaîtront en
                    premier.
                  </p>
                </div> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
