"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
  X,
  Image as ImageIcon,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useAccordionItems,
  useDeleteAccordionItem,
  useUpdateAccordionItem,
  useCreateAccordionItem,
  type CreateAccordionItemInput,
  type UpdateAccordionItemInput,
} from "@/hooks/useAccordion";
import { toast } from "sonner";
import Image from "next/image";
import { useEdgeStore } from "@/lib/edgestore";

interface UploadedImage {
  url: string;
  file: File;
  progress?: number;
}

export default function AccordionPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const { data: items = [], isLoading } = useAccordionItems();
  const createMutation = useCreateAccordionItem();
  const updateMutation = useUpdateAccordionItem();
  const deleteMutation = useDeleteAccordionItem();
  const { edgestore } = useEdgeStore();

  const [formData, setFormData] = useState<CreateAccordionItemInput>({
    title: "",
    image: "",
    alt: "",
    link: "",
    linkText: "",
    sortOrder: 0,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      image: "",
      alt: "",
      link: "",
      linkText: "",
      sortOrder: items.length,
      isActive: true,
    });
    setEditingItem(null);
    setImage(null);
    setUploadingImage(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop grande (max 5MB)");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      e.target.value = "";
      return;
    }

    // Supprimer l'ancienne image si elle existe
    if (image?.url && image.url.startsWith("http") && image.url.includes("files.edgestore.dev")) {
      try {
        await edgestore.publicFiles.delete({ url: image.url });
      } catch (error) {
        console.error("Error deleting old image:", error);
      }
    }

    const tempImage: UploadedImage = {
      url: URL.createObjectURL(file),
      file,
      progress: 0,
    };

    setImage(tempImage);
    setUploadingImage(tempImage.url);

    try {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setImage((prev) => (prev ? { ...prev, progress } : null));
        },
      });

      URL.revokeObjectURL(tempImage.url);

      setImage({
        url: res.url,
        file,
        progress: 100,
      });
      setFormData((prev) => ({ ...prev, image: res.url }));
      toast.success("Image uploadée avec succès");
    } catch (error: any) {
      toast.error("Erreur lors de l'upload de l'image");
      setImage(null);
      setFormData((prev) => ({ ...prev, image: "" }));
      URL.revokeObjectURL(tempImage.url);
    } finally {
      setUploadingImage(null);
      e.target.value = "";
    }
  };

  const handleRemoveImage = async () => {
    if (!image) return;

    if (image.url.startsWith("http") && image.url.includes("files.edgestore.dev")) {
      try {
        await edgestore.publicFiles.delete({ url: image.url });
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }

    if (image.url.startsWith("blob:")) {
      URL.revokeObjectURL(image.url);
    }

    setImage(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Élément créé avec succès");
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création");
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      image: item.image,
      alt: item.alt || "",
      link: item.link || "",
      linkText: item.linkText || "",
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    });
    if (item.image) {
      setImage({
        url: item.image,
        file: new File([], "existing-image"),
        progress: 100,
      });
    } else {
      setImage(null);
    }
    setEditingItem(item.id);
    setIsCreateOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    try {
      await updateMutation.mutateAsync({
        id: editingItem,
        data: formData,
      });
      toast.success("Élément mis à jour avec succès");
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    const itemToDelete = items.find((s) => s.id === deleteConfirm);

    if (itemToDelete?.image && itemToDelete.image.startsWith("http") && itemToDelete.image.includes("files.edgestore.dev")) {
      try {
        await edgestore.publicFiles.delete({ url: itemToDelete.image });
      } catch (error) {
        console.error("Error deleting image from EdgeStore:", error);
      }
    }

    try {
      await deleteMutation.mutateAsync(deleteConfirm);
      toast.success("Élément supprimé avec succès");
      setDeleteConfirm(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleToggleActive = async (item: any) => {
    try {
      await updateMutation.mutateAsync({
        id: item.id,
        data: { isActive: !item.isActive },
      });
      toast.success(`Élément ${!item.isActive ? "activé" : "désactivé"} avec succès`);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleMoveOrder = async (item: any, direction: "up" | "down") => {
    const currentIndex = items.findIndex((s) => s.id === item.id);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const targetItem = items[newIndex];
    const newSortOrder = targetItem.sortOrder;

    try {
      await Promise.all([
        updateMutation.mutateAsync({
          id: item.id,
          data: { sortOrder: newSortOrder },
        }),
        updateMutation.mutateAsync({
          id: targetItem.id,
          data: { sortOrder: item.sortOrder },
        }),
      ]);
      toast.success("Ordre mis à jour");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion de l'Accordéon Interactif</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les éléments de l'accordéon interactif de la page d'accueil
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Ajouter un élément
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Éléments de l'Accordéon</CardTitle>
          <CardDescription>
            {items.length} élément{items.length > 1 ? "s" : ""} configuré
            {items.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardAction>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin" />
              <span className="ml-2">Chargement...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Aucun élément configuré
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 size-4" />
                Créer le premier élément
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Ordre</TableHead>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Lien</TableHead>
                    <TableHead className="w-[100px]">Statut</TableHead>
                    <TableHead className="w-[150px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveOrder(item, "up")}
                            disabled={index === 0}
                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="size-4" />
                          </button>
                          <span className="text-sm font-semibold">
                            {item.sortOrder}
                          </span>
                          <button
                            onClick={() => handleMoveOrder(item, "down")}
                            disabled={index === items.length - 1}
                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="size-4" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative w-16 h-16 rounded overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.alt || item.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/placeholder.png";
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {item.linkText || item.link}
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            item.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {item.isActive ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(item)}
                          >
                            {item.isActive ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirm(item.id)}
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardAction>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Modifier l'élément" : "Créer un nouvel élément"}
            </DialogTitle>
            <DialogDescription>
              Configurez les informations de l'élément de l'accordéon
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Titre de l'élément"
              />
            </div>

            <div>
              <Label htmlFor="image">Image *</Label>
              <div className="space-y-4">
                {!image && (
                  <div className="relative flex min-h-32 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors">
                    <input
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="sr-only"
                      aria-label="Upload image file"
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      disabled={!!uploadingImage}
                    />
                    <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                      <div className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background">
                        <ImageIcon className="size-4 opacity-60" />
                      </div>
                      <p className="mb-1.5 text-sm font-medium">
                        Glissez votre image ici
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG ou WEBP (max. 5MB)
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          const input = document.getElementById(
                            "file-upload"
                          ) as HTMLInputElement;
                          input?.click();
                        }}
                        disabled={!!uploadingImage}
                      >
                        <Upload className="-ms-1 size-4 opacity-60" />
                        Sélectionner une image
                      </Button>
                    </div>
                  </div>
                )}

                {image && (
                  <div className="group relative aspect-video w-full overflow-hidden rounded-lg border">
                    <img
                      src={image.url}
                      alt={formData.alt || formData.title || "Preview"}
                      className="h-full w-full object-cover"
                    />
                    {image.progress !== undefined && image.progress < 100 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center">
                          <Loader2 className="mx-auto size-6 animate-spin text-white mb-2" />
                          <p className="text-sm text-white">
                            Upload en cours... {image.progress}%
                          </p>
                        </div>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={handleRemoveImage}
                      disabled={uploadingImage === image.url}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="alt">Texte alternatif (alt)</Label>
              <Input
                id="alt"
                value={formData.alt}
                onChange={(e) =>
                  setFormData({ ...formData, alt: e.target.value })
                }
                placeholder="Texte alternatif pour l'image"
              />
            </div>
            <div>
              <Label htmlFor="link">Lien de redirection (optionnel)</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="linkText">Texte du bouton (optionnel)</Label>
              <Input
                id="linkText"
                value={formData.linkText}
                onChange={(e) =>
                  setFormData({ ...formData, linkText: e.target.value })
                }
                placeholder="Acheter maintenant"
              />
            </div>
            <div>
              <Label htmlFor="sortOrder">Ordre d'affichage</Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sortOrder: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    isActive: checked as boolean,
                  })
                }
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Élément actif (affiché sur le site)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                resetForm();
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={editingItem ? handleUpdate : handleCreate}
              disabled={
                !formData.title ||
                !formData.image ||
                createMutation.isPending ||
                updateMutation.isPending ||
                !!uploadingImage
              }
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              {editingItem ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
