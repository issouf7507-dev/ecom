import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api/salon-catalogues";

export interface SalonCatalogueImage {
  id: string;
  catalogueId: string;
  url: string;
  sortOrder: number;
  createdAt: string;
}

export interface SalonCatalogue {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  gallery: SalonCatalogueImage[];
}

export interface CreateSalonCatalogueInput {
  slug: string;
  title: string;
  shortDescription?: string;
  coverImage?: string;
  sortOrder?: number;
  gallery?: string[];
}

export interface UpdateSalonCatalogueInput {
  slug?: string;
  title?: string;
  shortDescription?: string;
  coverImage?: string;
  sortOrder?: number;
  gallery?: string[];
}

export function useSalonCatalogues() {
  return useQuery({
    queryKey: ["salon-catalogues"],
    queryFn: async () => {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error("Failed to fetch catalogues");
      return response.json() as Promise<SalonCatalogue[]>;
    },
  });
}

export function useSalonCatalogue(id: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["salon-catalogue", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await fetch(`${API_BASE}/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch catalogue");
      }
      return response.json() as Promise<SalonCatalogue>;
    },
    enabled: !!id,
  });
}

export function useCreateSalonCatalogue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateSalonCatalogueInput) => {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create catalogue");
      }
      return response.json() as Promise<SalonCatalogue>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salon-catalogues"] });
    },
  });
}

export function useUpdateSalonCatalogue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSalonCatalogueInput;
    }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update catalogue");
      }
      return response.json() as Promise<SalonCatalogue>;
    },
    onSuccess: (_, v) => {
      queryClient.invalidateQueries({ queryKey: ["salon-catalogues"] });
      queryClient.invalidateQueries({ queryKey: ["salon-catalogue", v.id] });
    },
  });
}

export function useDeleteSalonCatalogue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete catalogue");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salon-catalogues"] });
    },
  });
}
