import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api/carousel";

export interface CarouselSlide {
  id: string;
  title: string;
  description: string | null;
  image: string;
  alt: string | null;
  link: string | null;
  linkText: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCarouselSlideInput {
  title: string;
  description?: string;
  image: string;
  alt?: string;
  link?: string;
  linkText?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCarouselSlideInput {
  title?: string;
  description?: string;
  image?: string;
  alt?: string;
  link?: string;
  linkText?: string;
  sortOrder?: number;
  isActive?: boolean;
}

// Fetch all carousel slides
export function useCarouselSlides(activeOnly = false) {
  return useQuery({
    queryKey: ["carousel-slides", activeOnly],
    queryFn: async () => {
      const url = `${API_BASE}${activeOnly ? "?activeOnly=true" : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch carousel slides");
      }

      return response.json() as Promise<CarouselSlide[]>;
    },
  });
}

// Fetch single carousel slide
export function useCarouselSlide(id: string | undefined) {
  return useQuery({
    queryKey: ["carousel-slide", id],
    queryFn: async () => {
      if (!id) return null;

      const response = await fetch(`${API_BASE}/${id}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch carousel slide");
      }

      return response.json() as Promise<CarouselSlide>;
    },
    enabled: !!id,
  });
}

// Create carousel slide mutation
export function useCreateCarouselSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCarouselSlideInput) => {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create carousel slide");
      }

      return response.json() as Promise<CarouselSlide>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel-slides"] });
    },
  });
}

// Update carousel slide mutation
export function useUpdateCarouselSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCarouselSlideInput;
    }) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update carousel slide");
      }

      return response.json() as Promise<CarouselSlide>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["carousel-slides"] });
      queryClient.invalidateQueries({
        queryKey: ["carousel-slide", variables.id],
      });
    },
  });
}

// Delete carousel slide mutation
export function useDeleteCarouselSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete carousel slide");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel-slides"] });
    },
  });
}
