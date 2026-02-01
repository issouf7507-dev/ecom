import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryFilters,
} from "@/lib/api/categories";
import { Status } from "@prisma/client";

const API_BASE = "/api/categories";

// Fetch categories
export function useCategories(filters?: CategoryFilters) {
  return useQuery({
    queryKey: ["categories", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.status && filters.status !== Status.ACTIVE) {
        params.append("status", filters.status);
      }
      if (filters?.search) {
        params.append("search", filters.search);
      }
      if (filters?.parentId !== undefined) {
        params.append("parentId", filters.parentId || "null");
      }

      const url = `${API_BASE}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      return response.json() as Promise<Category[]>;
    },
  });
}

// Fetch single category
export function useCategory(id: string | undefined) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      if (!id) return null;

      const response = await fetch(`${API_BASE}/${id}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch category");
      }

      return response.json() as Promise<Category>;
    },
    enabled: !!id,
  });
}

// Fetch category stats
export function useCategoryStats() {
  return useQuery({
    queryKey: ["category-stats"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/stats`);

      if (!response.ok) {
        throw new Error("Failed to fetch category stats");
      }

      return response.json() as Promise<{
        total: number;
        active: number;
        archived: number;
        draft: number;
        totalProducts: number;
      }>;
    },
  });
}

// Create category mutation
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create category");
      }

      return response.json() as Promise<Category>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category-stats"] });
    },
  });
}

// Update category mutation
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryInput;
    }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update category");
      }

      return response.json() as Promise<Category>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["category-stats"] });
    },
  });
}

// Delete category mutation
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete category");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category-stats"] });
    },
  });
}
