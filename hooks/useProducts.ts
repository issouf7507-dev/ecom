import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
} from "@/lib/api/produits";
import { Status } from "@prisma/client";

const API_BASE = "/api/products";

// Fetch products
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.status && filters.status !== Status.ACTIVE) {
        params.append("status", filters.status);
      }
      if (filters?.search) {
        params.append("search", filters.search);
      }
      if (filters?.categoryId) {
        params.append("categoryId", filters.categoryId);
      }
      if (filters?.featured !== undefined) {
        params.append("featured", filters.featured.toString());
      }
      if (filters?.isNewArrival !== undefined) {
        params.append("isNewArrival", filters.isNewArrival.toString());
      }
      if (filters?.isPreOrder !== undefined) {
        params.append("isPreOrder", filters.isPreOrder.toString());
      }
      if (filters?.minPrice !== undefined) {
        params.append("minPrice", filters.minPrice.toString());
      }
      if (filters?.maxPrice !== undefined) {
        params.append("maxPrice", filters.maxPrice.toString());
      }

      const url = `${API_BASE}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      return response.json() as Promise<Product[]>;
    },
  });
}

// Fetch single product
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;

      const response = await fetch(`${API_BASE}/${id}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch product");
      }

      return response.json() as Promise<Product>;
    },
    enabled: !!id,
  });
}

// Create product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductInput) => {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create product");
      }

      return response.json() as Promise<Product>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Update product mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductInput;
    }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update product");
      }

      return response.json() as Promise<Product>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
}

// Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete product");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
