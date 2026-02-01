import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import type {
  Category,
  CategoryWithChildren,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryFilters,
} from "./types";

export class CategoryRepository {
  async findAll(filters?: CategoryFilters): Promise<any[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
        { slug: { contains: filters.search } },
      ];
    }

    if (filters?.parentId !== undefined) {
      where.parentId = filters.parentId;
    }

    return prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }

  async findById(id: string): Promise<CategoryWithChildren | null> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) return null;

    return {
      ...category,
      productCount: category._count.products,
    } as unknown as CategoryWithChildren;
  }

  async findBySlug(slug: string): Promise<any | null> {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async create(data: CreateCategoryInput): Promise<any> {
    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        status: data.status as Status,
        sortOrder: data.sortOrder || 0,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async update(id: string, data: UpdateCategoryInput): Promise<any> {
    return prisma.category.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.parentId !== undefined && { parentId: data.parentId }),
        ...(data.status && { status: data.status as Status }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }

  async getStats(): Promise<{
    total: number;
    active: number;
    archived: number;
    draft: number;
    totalProducts: number;
  }> {
    const [total, active, archived, draft, totalProducts] = await Promise.all([
      prisma.category.count(),
      prisma.category.count({ where: { status: Status.ACTIVE } }),
      prisma.category.count({ where: { status: Status.ARCHIVED } }),
      prisma.category.count({ where: { status: Status.DRAFT } }),
      prisma.product.count(),
    ]);

    return {
      total,
      active,
      archived,
      draft,
      totalProducts,
    };
  }
}

export const categoryRepository = new CategoryRepository();
