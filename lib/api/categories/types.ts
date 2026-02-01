import { Status } from "@prisma/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  status: Status;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  productCount?: number;
}

export interface CategoryWithChildren extends Category {
  children?: Category[];
  parent?: Category | null;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  status?: string;
  sortOrder?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: string;
  status?: string;
  sortOrder?: number;
}

export interface CategoryFilters {
  status?: Status;
  search?: string;
  parentId?: string | null;
}

export interface CategoryStats {
  total: number;
  active: number;
  archived: number;
  draft: number;
  totalProducts: number;
}
