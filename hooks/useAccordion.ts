import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api/accordion";

export interface AccordionItem {
  id: string;
  title: string;
  image: string;
  alt: string | null;
  link: string | null;
  linkText: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccordionItemInput {
  title: string;
  image: string;
  alt?: string;
  link?: string;
  linkText?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateAccordionItemInput {
  title?: string;
  image?: string;
  alt?: string;
  link?: string;
  linkText?: string;
  sortOrder?: number;
  isActive?: boolean;
}

// Fetch all accordion items
export function useAccordionItems(activeOnly = false) {
  return useQuery({
    queryKey: ["accordion-items", activeOnly],
    queryFn: async () => {
      const url = `${API_BASE}${activeOnly ? "?activeOnly=true" : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch accordion items");
      }

      return response.json() as Promise<AccordionItem[]>;
    },
  });
}

// Fetch single accordion item
export function useAccordionItem(id: string | undefined) {
  return useQuery({
    queryKey: ["accordion-item", id],
    queryFn: async () => {
      if (!id) return null;

      const response = await fetch(`${API_BASE}/${id}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch accordion item");
      }

      return response.json() as Promise<AccordionItem>;
    },
    enabled: !!id,
  });
}

// Create accordion item mutation
export function useCreateAccordionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAccordionItemInput) => {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create accordion item");
      }

      return response.json() as Promise<AccordionItem>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accordion-items"] });
    },
  });
}

// Update accordion item mutation
export function useUpdateAccordionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAccordionItemInput;
    }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update accordion item");
      }

      return response.json() as Promise<AccordionItem>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["accordion-items"] });
      queryClient.invalidateQueries({
        queryKey: ["accordion-item", variables.id],
      });
    },
  });
}

// Delete accordion item mutation
export function useDeleteAccordionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete accordion item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accordion-items"] });
    },
  });
}
