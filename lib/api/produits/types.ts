import type { Status } from "@/lib/constants/status";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  barcode: string | null;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  taxRate: number;
  status: Status;
  featured: boolean;
  isNewArrival: boolean;
  releaseDate: Date | null;
  isPreOrder: boolean;
  availabilityDate: Date | null;
  availabilityTime: string | null;
  trackInventory: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  rating: number;
  reviewCount: number;
  viewCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  images?: ProductImage[];
  variants?: ProductVariant[];
  category?: { id: string; name: string; slug: string } | null;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number | null;
  stock: number;
  weight: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  taxRate?: number;
  status?: string;
  featured?: boolean;
  isNewArrival?: boolean;
  releaseDate?: Date;
  isPreOrder?: boolean;
  availabilityDate?: Date;
  availabilityTime?: string;
  trackInventory?: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  categoryId?: string;
  images?: Array<{
    url: string;
    alt?: string;
    sortOrder?: number;
    isPrimary?: boolean;
  }>;
  variants?: Array<{
    name: string;
    sku: string;
    price?: number;
    stock?: number;
    weight?: number;
  }>;
}

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  barcode?: string;
  price?: number;
  compareAtPrice?: number;
  costPrice?: number;
  taxRate?: number;
  status?: string;
  featured?: boolean;
  isNewArrival?: boolean;
  releaseDate?: Date;
  isPreOrder?: boolean;
  availabilityDate?: Date;
  availabilityTime?: string;
  trackInventory?: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  categoryId?: string;
}

export interface ProductFilters {
  status?: string;
  search?: string;
  categoryId?: string;
  featured?: boolean;
  isNewArrival?: boolean;
  isPreOrder?: boolean;
  minPrice?: number;
  maxPrice?: number;
  /** Max number of products to return (capped at 1000, default 500). */
  take?: number;
}
