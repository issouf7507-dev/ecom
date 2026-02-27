"use client";

import React, { useState, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
  ExternalLink,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { useEdgeStore } from "@/lib/edgestore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useSalonCatalogues,
  useCreateSalonCatalogue,
  useUpdateSalonCatalogue,
  useDeleteSalonCatalogue,
  type SalonCatalogue,
  type CreateSalonCatalogueInput,
} from "@/hooks/useSalonCatalogues";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

const defaultForm: CreateSalonCatalogueInput = {
  slug: "",
  title: "",
  shortDescription: "",
  coverImage: "/images/placeholder.png",
  gallery: [],
};

export default function CataloguePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCatalogue, setEditingCatalogue] = useState<SalonCatalogue | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateSalonCatalogueInput>(defaultForm);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const { data: catalogues = [], isLoading } = useSalonCatalogues();
  const createMutation = useCreateSalonCatalogue();
  const updateMutation = useUpdateSalonCatalogue();
  const deleteMutation = useDeleteSalonCatalogue();
  const { edgestore } = useEdgeStore();

  const resetForm = () => {
    setFormData(defaultForm);
    setGalleryUrls([]);
    setEditingCatalogue(null);
    setCoverUploading(false);
    setCoverProgress(0);
    setGalleryUploading(false);
  };

  const openCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEdit = (c: SalonCatalogue) => {
    setEditingCatalogue(c);
    setFormData({
      slug: c.slug,
      title: c.title,
      shortDescription: c.shortDescription,
      coverImage: c.coverImage,
      sortOrder: c.sortOrder,
    });
    setGalleryUrls(c.gallery.map((img) => img.url));
    setIsDialogOpen(true);
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image trop grande (max 5 Mo)");
      e.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image (PNG, JPG, WEBP)");
      e.target.value = "";
      return;
    }
    const currentCover = formData.coverImage;
    if (currentCover?.includes("files.edgestore.dev")) {
      try {
        await edgestore.publicFiles.delete({ url: currentCover });
      } catch (err) {
        console.error("Error deleting old cover:", err);
      }
    }
    setCoverUploading(true);
    setCoverProgress(0);
    try {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => setCoverProgress(progress),
      });
      setFormData((p) => ({ ...p, coverImage: res.url }));
      toast.success("Image de couverture uploadée");
    } catch {
      toast.error("Erreur lors de l'upload");
    } finally {
      setCoverUploading(false);
      setCoverProgress(0);
      e.target.value = "";
    }
  };

  const handleRemoveCoverImage = async () => {
    const url = formData.coverImage;
    if (url?.includes("files.edgestore.dev")) {
      try {
        await edgestore.publicFiles.delete({ url });
      } catch (err) {
        console.error("Error deleting cover from EdgeStore:", err);
      }
    }
    setFormData((p) => ({ ...p, coverImage: "/images/placeholder.png" }));
  };

  const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image trop grande (max 5 Mo)");
      e.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      e.target.value = "";
      return;
    }
    setGalleryUploading(true);
    try {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: () => {},
      });
      setGalleryUrls((prev) => [...prev, res.url]);
      toast.success("Image ajoutée à la galerie");
    } catch {
      toast.error("Erreur lors de l'upload");
    } finally {
      setGalleryUploading(false);
      e.target.value = "";
    }
  };

  const removeGalleryUrl = async (index: number) => {
    const url = galleryUrls[index];
    if (url?.includes("files.edgestore.dev")) {
      try {
        await edgestore.publicFiles.delete({ url });
      } catch (err) {
        console.error("Error deleting image from EdgeStore:", err);
      }
    }
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const gallery = galleryUrls.filter((u) => u.trim());
    const payload = {
      ...formData,
      coverImage: formData.coverImage || "/images/placeholder.png",
      gallery,
    };

    if (editingCatalogue) {
      try {
        await updateMutation.mutateAsync({
          id: editingCatalogue.id,
          data: payload,
        });
        toast.success("Catalogue mis à jour");
        setIsDialogOpen(false);
        resetForm();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      }
    } else {
      try {
        await createMutation.mutateAsync(payload);
        toast.success("Catalogue créé");
        setIsDialogOpen(false);
        resetForm();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Erreur lors de la création");
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirm);
      toast.success("Catalogue supprimé");
      setDeleteConfirm(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold orbitron">Salon de beauté</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les catalogues de décoration (vintage, moderne, etc.) et leurs galeries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/salon-de-beaute" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 size-4" />
              Voir le site
            </Button>
          </Link>
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            Ajouter un catalogue
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalogues</CardTitle>
          <CardDescription>
            {catalogues.length} catalogue{catalogues.length !== 1 ? "s" : ""} (styles de décoration)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin" />
              <span className="ml-2">Chargement...</span>
            </div>
          ) : catalogues.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Aucun catalogue. Créez-en un pour afficher des styles sur la page Salon de beauté.
              </p>
              <Button onClick={openCreate}>
                <Plus className="mr-2 size-4" />
                Créer le premier catalogue
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead className="w-[80px]">Galerie</TableHead>
                    <TableHead className="w-[140px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalogues.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="relative w-14 h-14 rounded overflow-hidden bg-muted">
                          <Image
                            src={c.coverImage || "/images/placeholder.png"}
                            alt={c.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{c.slug}</code>
                      </TableCell>
                      <TableCell className="font-medium">{c.title}</TableCell>
                      <TableCell>{c.gallery?.length ?? 0} image(s)</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(c)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirm(c.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && (setIsDialogOpen(false), resetForm())}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCatalogue ? "Modifier le catalogue" : "Nouveau catalogue"}
            </DialogTitle>
            <DialogDescription>
              Slug = URL (ex: vintage, moderne). Titre et description affichés sur le site. La galerie s’affiche quand on clique sur le style.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                placeholder="vintage"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="Décoration vintage"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Description courte</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription || ""}
                onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
                placeholder="Ambiance rétro et chaleureuse..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Image de couverture</Label>
              {(formData.coverImage && formData.coverImage !== "/images/placeholder.png") ? (
                <div className="group relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={formData.coverImage}
                    alt="Couverture"
                    fill
                    className="object-cover"
                    sizes="(max-width: 512px) 100vw, 512px"
                  />
                  {coverUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center text-white">
                        <Loader2 className="mx-auto size-6 animate-spin mb-2" />
                        <p className="text-sm">Upload… {coverProgress}%</p>
                      </div>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleRemoveCoverImage}
                    disabled={coverUploading}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-input p-4">
                  <input
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="sr-only"
                    aria-label="Upload image de couverture"
                    type="file"
                    id="cover-upload"
                    onChange={handleCoverFileChange}
                    disabled={coverUploading}
                  />
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background">
                      <ImageIcon className="size-5 opacity-60" />
                    </div>
                    <p className="text-sm font-medium">Image de couverture</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG ou WEBP (max 5 Mo)</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-3"
                      onClick={() => document.getElementById("cover-upload")?.click()}
                      disabled={coverUploading}
                    >
                      <Upload className="mr-2 size-4" />
                      {coverUploading ? "Upload en cours…" : "Choisir une image"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Galerie (images du portfolio)</Label>
                <input
                  ref={galleryInputRef}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  type="file"
                  className="sr-only"
                  aria-label="Ajouter une image à la galerie"
                  onChange={handleGalleryFileChange}
                  disabled={galleryUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={galleryUploading}
                >
                  {galleryUploading ? (
                    <Loader2 className="mr-1 size-4 animate-spin" />
                  ) : (
                    <Plus className="mr-1 size-4" />
                  )}
                  Ajouter une image
                </Button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto rounded-lg border p-2">
                {galleryUrls.map((url, i) => (
                  <div key={i} className="group relative aspect-square rounded-md overflow-hidden bg-muted">
                    <Image
                      src={url}
                      alt={`Galerie ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-1 top-1 size-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeGalleryUrl(i)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {editingCatalogue ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce catalogue ?</DialogTitle>
            <DialogDescription>
              La galerie sera aussi supprimée. Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
